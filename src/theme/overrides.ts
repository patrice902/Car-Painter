const overrides = {
  MuiCssBaseline: {
    "@global": {
      html: {
        WebkitFontSmoothing: "auto",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "#666666",
      },
      "::-webkit-scrollbar": {
        backgroundColor: "#202121",
      },
      "::-webkit-scrollbar:vertical": {
        width: "10px",
      },
      "::-webkit-scrollbar:horizontal": {
        height: "10px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#37393a",
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "#37393a",
      },
    },
  },
  MuiCard: {
    root: {
      borderRadius: "6px",
      boxShadow:
        "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
    },
  },
  MuiCardHeader: {
    action: {
      marginTop: "-4px",
      marginRight: "-4px",
    },
  },
  MuiChip: {
    root: {
      borderRadius: "6px",
    },
  },
  MuiDivider: {
    root: {
      backgroundColor: "#8A8A8A",
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: "#444",
      border: "1px solid gray",
    },
  },
  MuiDialog: {
    paperScrollPaper: {
      overflowX: "hidden",
    },
  },
  MuiInput: {
    underline: {
      "&:before": {
        borderBottom: "0px !important",
      },
      "&:after": {
        borderBottom: "0px !important",
      },
      "&:hover:before": {
        borderBottom: "0px !important",
      },
    },
  },
  MuiOutlinedInput: {
    input: {
      padding: "6px 14px",
      borderBottom: "none",
    },
  },
  MuiInputBase: {
    input: {
      fontFamily: "AkkuratMonoLLWeb-Regular",
      fontSize: "14px",
      height: "2rem",
      "@media only screen and (max-width: 600px)": {
        fontSize: "16px",
      },
      "&:-webkit-autofill": {
        "-webkit-box-shadow": "0 0 0 100px #444 inset !important",
      },
      "&[type='number']": {
        padding: "6px",
      },
    },
  },
  MuiSelect: {
    select: {
      fontFamily: "CircularXXWeb-Regular",
    },
  },
  // MuiInputLabel: {
  //   outlined: {
  //     transform: "translate(14px, 14px) scale(1)",
  //     overflow: "hidden",
  //     textOverflow: "ellipsis",
  //     whiteSpace: "nowrap",
  //     width: "100%",
  //   },
  // },
  MuiAccordion: {
    rounded: {
      borderRadius: "6px",
    },
    root: {
      "&:before": {
        display: "none",
      },
      margin: "4px 0 !important",
    },
  },
  MuiAccordionSummary: {
    root: {
      minHeight: "50px !important",
      padding: "0 12px",
    },
    content: {
      margin: "8px 0 !important",
    },
  },
  MuiAccordionDetails: {
    root: {
      padding: "4px 12px 12px",
    },
  },
  MuiAutocomplete: {
    input: {
      height: "1.1876rem",
      fontFamily: "CircularXXWeb-Regular",
    },
  },
  MuiDropzoneArea: {
    root: {
      minHeight: "105px",
    },
  },
  MuiDropzonePreviewList: {
    image: {
      objectFit: "contain",
    },
  },
};

export default overrides;
