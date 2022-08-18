import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image (https://cdn.britannica.com/02/146902-050-EF174421/gardens-Maymyo-Myanmar.jpg)
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  
  app.get("/filteredimage",async ( req:express.Request, res:express.Response ) => {
    console.log(req.query)
//    1. validate the image_url query
    let { image_url } : {image_url: string} = req.query;
    if (image_url != undefined) {
      //url is available

      try {
//    2. call filterImageFromURL(image_url) to filter the image
        let outpath = await filterImageFromURL(image_url);

//    3. send the resulting file in the response
        res.sendFile(outpath, () => {
//    4. deletes any files on the server on finish of the response
          deleteLocalFiles([outpath])
        })
      } catch (error) {
        res.status(400).send('The image can not be filtered - check the link submitted ');

      }
    }else{
      res.status(400).send('Image url not available');
    }
  });
  /*****************************************************************************/

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async ( req:express.Request, res:express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();