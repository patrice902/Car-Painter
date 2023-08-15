export const imageToCanvas = (
  eventTarget: HTMLImageElement
): Promise<HTMLCanvasElement> => {
  if (eventTarget.nodeName !== "IMG") {
    throw new Error("imageToCanvas: event target not of node type img");
  }

  return new Promise((resolve) => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = eventTarget.width;
    canvasElement.height = eventTarget.height;
    const context = canvasElement.getContext("2d");

    if (!context) {
      throw new Error("elementToCanvas: context is null");
    }

    // Allows for cross origin images
    const handleLoad = () => {
      context.drawImage(
        downloadedImg,
        0,
        0,
        eventTarget.width,
        eventTarget.height
      );
      resolve(canvasElement);
    };
    const imageURL = eventTarget.src;
    const downloadedImg = new Image();
    downloadedImg.width = eventTarget.width;
    downloadedImg.height = eventTarget.height;
    downloadedImg.crossOrigin = "Anonymous";
    downloadedImg.addEventListener("load", handleLoad);
    downloadedImg.src = imageURL;
  });
};
