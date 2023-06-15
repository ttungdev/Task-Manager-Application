const express = require('express');
const router = express.Router();
const yup = require('yup');

const { write } = require('../helpers/FileHelper');
let data = require('../data/task.json');

const fileName = './data/task.json';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(data);
});


// Create new data
router.post('/', function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      task: yup.string().required(),
      process: yup.string().required(),
      priority:yup.string().required()
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newItem = req.body;

      // Get max id
      let max = 0;
      data.forEach((item) => {
        if (max < item.id) {
          max = item.id;
        }
      });

      newItem.id = max + 1;

      data.push(newItem);

      // Write data to file
      write(fileName, data);

      res.send({ ok: true, message: 'Created' });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, provider: 'yup' });
    });
});

// UPDATE
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;

  let found = data.find((x) => x.id == id);

  if (found) {
    for (let propertyName in patchData) {
      found[propertyName] = patchData[propertyName];
    }
  }
  // Write data to file
  write(fileName, data);

  res.send({ ok: true, message: 'Updated' });
});

// DELETE
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  // Write data to file
  write(fileName, data);

  res.send({ ok: true, message: 'Deleted' });
});

module.exports = router;
