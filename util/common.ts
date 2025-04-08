import { Alert } from "react-native";

export const confirmAction = (title: string, message: string) => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Yes",
          onPress: () => resolve(true),
        },
        {
          text: "No",
          onPress: () => resolve(false),
        },
      ],
      { cancelable: false }
    );
  });
};

export const getHTMLImageRender = (
  preview_src: string | string[],
  imageIDRenderHandle?: (id: string) => string
) => {
  if (Array.isArray(preview_src) && imageIDRenderHandle) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: black;
          }
          img {
            width: 100%;
            height: auto;
          }
          p {
            font-size: 3rem;
            color: white;
            text-align: center;
            padding: 6rem 0; /* Equivalent to py-24 in Tailwind */
          }
          div {
            width: 100%;
            height: 10rem;
            background-color: black
          }
        </style>
      </head>
      <body>
        <div></div>
        ${preview_src
          .map(
            (item) => `<img src="${imageIDRenderHandle(item)}" alt="Image"/>`
          )
          .join("")}
        <p>Nothing Follows</p>
      </body>
    </html>`;
  } else {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Use full height of the viewport */
            background-color: black;
          }
          img {
            max-width: 100%; /* Ensure it doesn't exceed the width */
            max-height: 100%; /* Ensure it doesn't exceed the height */
            object-fit: contain; /* Maintain aspect ratio */
          }
        </style>
      </head>
      <body>
        <img src="${
          typeof preview_src === "string" && encodeURI(preview_src)
        }" alt="Full Screen Image" />
      </body>
    </html>
  `;
  }
};

export const convertToBase64 = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject("Error converting image to Base64");
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return undefined;
  }
};
