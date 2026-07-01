const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5000",
        credentials: true,
    }),
);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, (e) => {
    console.log(`> server
> Running on port ${PORT}

                                           
                                           
                             MNMMM         
                           NMMMMMMMN       
                         MMMMMMMMMMMMN     
                          MMMMMMMMMMMMM    
                     NMM    MNMMMMMMMMM    
                   NNMMMNN    MMMMMMMN     
                 NNMMMMMMMMN    NNMNM      
               MNMMMMMMMMMMMMN   MM        
              NMMMMMMMMMMMMMMMMM           
            NMMMMMMMMMMMMMMMMMN            
          MNMMMMMMMMMMMMMMMMM              
        MMMMMMMMMMMMMMMMMMNM               
       MMMMMMMMMMMMMMMMMNM                 
      NMMMMMMMMMMMMMMMNM                   
      MMMMMMMMMMMMMMMM                     
      MMMMMMMMMMMMMMN                       
      MMMMMMMMMMMMM                         
      MMMMMMMNNMM                                                            
                                           
                                           

⚪ Express.js 5.2.1
- Local:         http://localhost:${PORT}
- Network:       http://192.168.1.5:${PORT}
- Environment: ${ENV}`);
});
