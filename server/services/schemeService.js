const _ = require("lodash");
const Scheme = require("../models/scheme.model");
const {
  generateRandomColor,
  getSchemeUpdatingInfo,
  checkSQLWhereInputValid,
} = require("../utils/common");
const LayerService = require("./layerService");
const { LayerTypes, TemplateVariables } = require("../constants");
const logger = require("../config/winston");
const LogoService = require("./logoService");
const FontService = require("./fontService");

class SchemeService {
  static async getList() {
    const schemes = await Scheme.query()
      .where("avail", 1)
      .withGraphFetched(
        "[carMake.[bases], layers, originalAuthor(minSelects), originalScheme]"
      );

    return schemes;
  }

  static async getListByUserID(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const schemes = await Scheme.query()
      .where("avail", 1)
      .where("user_id", user_id)
      .withGraphFetched(
        "[carMake, user(minSelects), originalAuthor(minSelects), originalScheme, sharedUsers.[user(minSelects)]]"
      );

    return schemes;
  }

  static async getPublicList() {
    const schemes = await Scheme.query()
      .where("avail", 1)
      .where("public", 1)
      .withGraphFetched(
        "[carMake, user(minSelects), sharedUsers.[user(minSelects)]]"
      );

    return schemes;
  }

  static async getPublicListByUserID(user_id) {
    if (!checkSQLWhereInputValid(user_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const schemes = await Scheme.query()
      .where("avail", 1)
      .where("public", 1)
      .where("user_id", user_id)
      .withGraphFetched("[carMake, user(minSelects)]");

    return schemes;
  }

  static async getById(id) {
    if (!id) {
      console.log("Trying to get scheme with ID of null");
      return null;
    }

    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const scheme = await Scheme.query()
      .findById(id)
      .withGraphFetched(
        "[carMake.[bases], layers, sharedUsers, user(minSelects), lastModifier(minSelects)]"
      );

    return scheme;
  }

  static async create(userID, carMakeID, name, legacy_mode) {
    let schemeName = name && name.length ? name : "Untitled Scheme";

    let schemeList = await this.getListByUserID(userID);
    let number = 0;

    const defaultGuideData = {
      wireframe_opacity: 0.1,
      show_wireframe: true,
      blend_wireframe: true,
      sponsor_opacity: 0.3,
      show_sponsor: true,
      numberblock_opacity: 0.2,
      show_numberBlocks: true,
      show_number_block_on_top: true,
      show_carparts_on_top: true,
    };

    for (let item of schemeList) {
      if (item.name.includes(schemeName)) {
        const extraIndex = parseInt(item.name.substr(schemeName.length));
        if (!extraIndex) number = 1;
        else if (extraIndex >= number) number = extraIndex + 1;
      }
    }
    if (number) schemeName = `${schemeName} ${number}`;

    const scheme = await Scheme.query().insert({
      name: schemeName,
      base_color: generateRandomColor(),
      car_make: carMakeID,
      user_id: userID,
      date_created: Math.round(new Date().getTime() / 1000),
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: userID,
      preview_pic: 0,
      showroom_id: 0,
      base_id: 0,
      finished: 0,
      avail: 1,
      legacy_mode,
      guide_data: JSON.stringify(defaultGuideData),
      hide_spec: 1,
      on_do: 0,
      file_missing: 0,
      original_scheme_id: 0,
      original_author_id: 0,
    });
    return scheme;
  }

  static async createCarmakeLayers(
    scheme,
    carMake,
    user,
    legacy = false,
    shouldCreateLogosTexts = false
  ) {
    let carMake_builder_layers = JSON.parse(
      legacy ? carMake.builder_layers : carMake.builder_layers_2048
    );
    let layer_index = 1;
    let builder_layers = [];
    for (let layer of carMake_builder_layers) {
      builder_layers.push(
        await LayerService.create({
          layer_type: LayerTypes.CAR,
          scheme_id: scheme.id,
          upload_id: 0,
          layer_data: JSON.stringify({
            img: layer.img,
            name: layer.name,
          }),
          layer_visible: layer.visible,
          layer_order: layer_index++,
          layer_locked: 0,
          time_modified: 0,
          confirm: "",
          on_do: 0,
          file_missing: 0,
        })
      );
    }

    if (shouldCreateLogosTexts) {
      let builder_logos =
        carMake.builder_logo && carMake.builder_logo.length
          ? JSON.parse(carMake.builder_logo)
          : [];
      for (let layer of builder_logos) {
        if (layer.id) {
          try {
            let logo = await LogoService.getById(layer.id);
            if (logo) {
              builder_layers.push(
                await LayerService.create({
                  layer_type: LayerTypes.LOGO,
                  scheme_id: scheme.id,
                  upload_id: 0,
                  layer_data: JSON.stringify({
                    id: logo.id,
                    name: logo.name,
                    rotation: parseFloat(layer.rotation) || 0,
                    left: parseFloat(layer.left) || 0,
                    top: parseFloat(layer.top) || 0,
                    width: parseFloat(layer.width) || 0,
                    height: parseFloat(layer.height) || 0,
                    source_file: logo.source_file,
                    preview_file: logo.preview_file,
                  }),
                  layer_visible: 1,
                  layer_order: layer_index++,
                  layer_locked: 0,
                  time_modified: 0,
                  on_do: 0,
                  file_missing: 0,
                  confirm: "",
                })
              );
            }
          } catch (err) {
            logger.log("error", err.stack);
          }
        }
      }

      let builder_signature =
        carMake.builder_signature && carMake.builder_signature.length
          ? JSON.parse(carMake.builder_signature)
          : [];

      const guide_data = JSON.parse(scheme.guide_data);
      for (let layer of builder_signature) {
        if (layer.font) {
          // Creating Font Signature
          try {
            let font = await FontService.getById(layer.font);
            if (font) {
              builder_layers.push(
                await LayerService.create({
                  layer_type: LayerTypes.TEXT,
                  scheme_id: scheme.id,
                  upload_id: 0,
                  layer_data: JSON.stringify({
                    name: "Driver Name",
                    text: TemplateVariables.PROFILE_NAME,
                    font: parseInt(layer.font),
                    size: parseInt(layer.size),
                    color: layer.color || guide_data.defaultColor,
                    stroke: 0,
                    scolor: layer.scolor || guide_data.default_shape_scolor,
                    rotation: parseFloat(layer.rotation) || 0,
                    left: parseFloat(layer.left) || 0,
                    top: parseFloat(layer.top) || 0,
                    width: parseFloat(layer.width) || 0,
                    height: parseFloat(layer.height) || 0,
                  }),
                  layer_visible: 1,
                  layer_order: layer_index++,
                  layer_locked: 0,
                  time_modified: 0,
                  on_do: 0,
                  file_missing: 0,
                  confirm: "",
                })
              );
            }
          } catch (err) {
            logger.log("error", err.stack);
          }
        } else {
          // Creating Profile Signature
          try {
            builder_layers.push(
              await LayerService.create({
                layer_type: LayerTypes.CAR,
                scheme_id: scheme.id,
                upload_id: 0,
                layer_data: JSON.stringify({
                  img: TemplateVariables.PROFILE_AVATAR,
                  isFullUrl: true,
                  name: layer.name ? layer.name : "Profile Image",
                  rotation: layer.rotation ? parseFloat(layer.rotation) : 0,
                  left: layer.left ? parseFloat(layer.left) : 0,
                  top: layer.top ? parseFloat(layer.top) : 0,
                  width: layer.width ? parseFloat(layer.width) : 0,
                  height: layer.height ? parseFloat(layer.height) : 0,
                }),
                layer_visible: 1,
                layer_order: layer_index++,
                layer_locked: 0,
                time_modified: 0,
                on_do: 0,
                file_missing: 0,
                confirm: "",
              })
            );
          } catch (err) {
            logger.log("error", err.stack);
          }
        }
      }
    }

    return builder_layers;
  }

  static async updateById(id, payload) {
    if (!id) {
      console.log("Trying to update scheme with ID of null: ", payload);
      return null;
    }

    const scheme = await this.getById(id);

    await Scheme.query().patchAndFetchById(
      id,
      getSchemeUpdatingInfo(scheme, payload)
    );

    return await this.getById(id);
  }

  static async deleteById(id) {
    if (!id) {
      return null;
    }

    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Scheme.query().deleteById(id);

    return true;
  }

  static async cloneById(id, user_id) {
    if (!id) {
      return null;
    }

    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let originalScheme = await Scheme.query()
      .findById(id)
      .withGraphFetched("layers");

    const scheme = await Scheme.query().insert({
      ..._.omit(originalScheme, ["id", "layers"]),
      user_id,
      name: originalScheme.name.slice(0, 45) + " copy",
      date_created: Math.round(new Date().getTime() / 1000),
      date_modified: Math.round(new Date().getTime() / 1000),
      public: false,
      thumbnail_updated: 0,
      original_scheme_id: id,
      original_author_id: originalScheme.user_id,
    });

    for (let layer of originalScheme.layers) {
      await LayerService.create({
        ..._.omit(layer, ["id"]),
        scheme_id: scheme.id,
      });
    }

    return await this.getById(scheme.id);
  }
}

module.exports = SchemeService;
