export type DefaultSettingsFormValues = {
  default_shape_color: string;
  default_shape_opacity: number;
  default_shape_scolor: string;
  default_shape_stroke: number;
};

export type DefaultSettingsDialogProps = {
  onCancel: () => void;
  open: boolean;
  onApply: (values: DefaultSettingsFormValues) => void;
};
