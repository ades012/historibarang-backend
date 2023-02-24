const express = require('express');
const md5 = require('md5');
const app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const env = require('dotenv').config();
const port = 3001;
const cors = require("cors");

// CREATE DATETIME NOW()
const now = new Date();
const datetime = now.toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

// body: x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// body: raw -> json
app.use(express.json({ extended: true }));

app.use(cors());

// IMPORT CONNECTION MODULE
const config = require('./connection.js');
const { urlencoded } = require('express');
var connection = config.connection;

// =========================================================================================================================================

// GET ALL USER DATA
app.get('/api/histori', (req, res) => {
  connection.query("SELECT id_transaksi, id_barang, type, date, nama, kuantitas FROM histori_barang", (error, results, fields) => { 
    if (error) throw error;
    res.status(200);
    res.json(
      { 
          status: "OK",
          data: results
      }
    )
  });
});

// GET USER DATA BY ID
app.get('/api/kategori/:id', (req, res) => {
    connection.query("id_transaksi, id_barang, type, date, nama, kuantitas FROM histori_barang WHERE id_transaksi = '"+req.params.id+"'", (error, results, fields) => { 
      if (error) throw error;
      res.status(200);
      res.json(
        { 
            status: "OK",
            data: results
        }
      )
    });
});


app.post("/api/histori", (req, res) => {
  const v_id_transaksi = req.body.v_id_transaksi;
  const idBarang = req.body.id_barang;
  const typeHistori = req.body.v_type;
  const v_date = req.body.v_date;
  const v_nama = req.body.v_nama;
  const v_kuantitas = req.body.v_kuantitas;

  if (typeHistori === "KELUAR") {
    connection.query(
      `INSERT INTO histori_barang (id_transaksi, id_barang, type, date, nama, kuantitas) VALUES ('${v_id_transaksi}', '${idBarang}', '${typeHistori}', '${v_date}', '${v_nama}', '${v_kuantitas}');`,
      (error, results, fields) => {
        if (error) throw error;
        connection.query(
          `UPDATE data_barang SET jumlah_barang = jumlah_barang - ${v_kuantitas} WHERE id_barang = '${idBarang}'`,
          (error, results, fields) => {
            if (error) throw error;
            res.send({ status : "OK" });
          }
        );
      }
    );
  } else if (typeHistori === "MASUK") {
    connection.query(
      `INSERT INTO histori_barang (id_transaksi, id_barang, type, date, nama, kuantitas) VALUES ('${v_id_transaksi}', '${idBarang}', '${typeHistori}', '${v_date}', '${v_nama}', '${v_kuantitas}');`,
      (error, results, fields) => {
        if (error) throw error;
        connection.query(
          `UPDATE data_barang SET jumlah_barang = jumlah_barang + ${v_kuantitas} WHERE id_barang = '${idBarang}'`,
          (error, results, fields) => {
            if (error) throw error;
            res.send({ status : "OK" });
          }
        );
      }
    );
  } else {
    res.status(400).send("Type Histori tidak valid!");
  }
});



app.listen(port, () => {
  console.log("== SERVICE-AUTH ==");
  console.log(`server listening at http://localhost:${port}`);
});
