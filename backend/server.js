const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'rs_tech'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/employees', (req, res) => {
  const { name, employeeId, department, designation, project, type, status } = req.body;
  db.query(
    'INSERT INTO employees (name, employeeId, department, designation, project, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, employeeId, department, designation, project, type, status],
    err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

app.put('/employees/:id', (req, res) => {
  const { name, employeeId, department, designation, project, type, status } = req.body;
  db.query(
    'UPDATE employees SET name=?, employeeId=?, department=?, designation=?, project=?, type=?, status=? WHERE id=?',
    [name, employeeId, department, designation, project, type, status, req.params.id],
    err => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

app.delete('/employees/:id', (req, res) => {
  db.query('DELETE FROM employees WHERE id=?', [req.params.id], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
