import imageToBase64 from "image-to-base64";
import PdfPrinter from "pdfmake";

export const getPDFReadableStream = async (movie) => {
  async function createBase64Img(url) {
    let base64Encoded = await imageToBase64(url);
    return "data:image/jpg;base64, " + base64Encoded;
  }

  // Define font files
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica",
      italics: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: movie.Title, style: "header", margin: [0, 15, 0, 0] },
      { text: movie.Genre, style: "quote", margin: [0, 2] },
      { text: movie.Runtime, style: "quote", margin: [0, 2] },
      { text: movie.Year, style: "quote", margin: [0, 2] },
      { text: movie.Director, style: "quote", margin: [0, 2] },
      { text: movie.Released, style: "quote", margin: [0, 2] },
      { text: movie.Actors, style: "quote", margin: [0, 2] },
      { text: movie.Plot, style: "quote", margin: [0, 2] },
      { image: "movieCover", width: 200, height: 300, margin: [0, 10, 0, 0] },
    ],
    images: {
      movieCover: await createBase64Img(movie.Poster),
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        color: "#123123",
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
