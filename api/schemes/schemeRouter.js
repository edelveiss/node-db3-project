const express = require("express");
const Schemes = require("../../data/helpers/schemeModel.js");
const Steps = require("../../data/helpers/stepModel.js");
const router = express.Router();

router.post("/", validateScheme, (req, res) => {
  Schemes.add(req.body)
    .then((scheme) => {
      res.status(201).json(scheme);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the scheme",
      });
    });
});

router.post("/:id/steps", validateSchemeId, validateStep, (req, res) => {
  Steps.add(req.step)
    .then((step) => {
      res.status(201).json(step);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the step",
      });
    });
});

router.get("/", (req, res) => {
  Schemes.find()
    .then((schemes) => {
      res.status(200).json(schemes);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the schemes",
      });
    });
});

router.get("/:id", validateSchemeId, (req, res) => {
  res.status(200).json(req.scheme);
});

router.get("/:id/steps", validateSchemeId, (req, res) => {
  Schemes.findSteps(req.scheme.id)
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

router.delete("/:id", validateSchemeId, (req, res) => {
  Schemes.remove(req.scheme.id)
    .then((scheme) => {
      res.status(200).json(scheme);
    })
    // .then((count) => {
    //   if (count > 0) {
    //     res.status(200).json(req.scheme);
    //   } else {
    //     res.status(404).json({ message: "The scheme could not be found" });
    //   }
    // })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the scheme",
      });
    });
});

router.put("/:id", validateSchemeId, validateScheme, (req, res) => {
  Schemes.update(req.scheme.id, req.body)
    .then((count) => {
      if (count) {
        Schemes.findById(req.scheme.id)
          .then((scheme) => {
            res.status(200).json(scheme);
          })
          .catch((err) => {
            req
              .status(500)
              .json({ message: "An error occured during getting scheme" });
          });
      } else {
        res.status(404).json({ message: "The scheme could not be found" });
      }
    })
    .catch((error) => {
      res.statusMessage = "Error updating the scheme";
      console.log(error);
      res.status(500).json({
        message: "Error updating the scheme",
      });
    });
});

//custom middleware
function validateSchemeId(req, res, next) {
  const { id } = req.params;
  Schemes.findById(id)
    .then((scheme) => {
      if (scheme) {
        req.scheme = scheme;
        next();
      } else {
        res.status(400).json({ message: "invalid scheme id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "failed", err });
    });
}

function validateScheme(req, res, next) {
  if (!isEmpty(req.body)) {
    if (!req.body.scheme_name) {
      res.statusMessage = "missing required scheme name  field";
      res.status(400).json({ message: "missing required scheme name field" });
      //res.status(400).end();
    } else {
      next();
    }
  } else {
    res.statusMessage = "missing scheme data";
    res.status(400).json({ message: "missing scheme data" });
  }
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
      req.step = {
        ...req.body,
        scheme_id: req.scheme.id,
      };
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
