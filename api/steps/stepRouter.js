const express = require("express");
const Steps = require("../../data/helpers/stepModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Steps.find()
    .then((steps) => {
      res.status(200).json(steps);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the steps",
      });
    });
});

router.get("/:id", validateStepId, (req, res) => {
  res.status(200).json(req.step);
});

router.delete("/:id", validateStepId, (req, res) => {
  Steps.remove(req.step.id)
    .then((id) => res.status(200).json(id))
    // .then((count) => {
    //   if (count > 0) {
    //     res.status(200).json(req.step);
    //   } else {
    //     res.status(404).json({ message: "The step could not be found" });
    //   }
    // })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the step",
      });
    });
});

router.put("/:id", validateStepId, validateStep, (req, res) => {
  Steps.update(req.step.id, req.body)
    .then((id) => {
      if (id) {
        Steps.findById(req.step.id)
          .then((step) => {
            res.status(200).json(step);
          })
          .catch((err) => {
            req
              .status(500)
              .json({ message: "An error occured during getting step" });
          });
      } else {
        res.status(404).json({ message: "The step could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the step",
      });
    });
});

// custom middleware

function validateStepId(req, res, next) {
  const { id } = req.params;
  Steps.findById(id)
    .then((step) => {
      if (step) {
        req.step = step;
        next();
      } else {
        res.statusMessage = "invalid step id";
        res.status(400).json({ message: "invalid step id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "failed", err });
    });
}
function validateStep(req, res, next) {
  if (!isEmpty(req.body)) {
    if (!req.body.step_number) {
      res.statusMessage = "missing required step_number field";
      res.status(400).json({ message: "missing required step_number field" });
    } else if (!req.body.instructions) {
      res.statusMessage = "missing required instructions field";
      res.status(400).json({ message: "missing required instructions field" });
    } else {
      // req.step = {
      //   ...req.body,
      //   scheme_id: req.scheme.id,
      // };
      next();
    }
  } else {
    res.statusMessage = "missing step data";
    res.status(400).json({ message: "missing step data" });
  }
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
module.exports = router;
