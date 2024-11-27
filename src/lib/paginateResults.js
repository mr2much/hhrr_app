module.exports = (Model, collection) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneById(id).populate(collection);
    const nextDocument = await Model.findOne({ _id: { $gt: id } }).sort({
      _id: 1,
    });

    const previousDocument = await Model.findOne({ _id: { $lt: id } }).sort({
      _id: -1,
    });

    const results = { document, nextDocument, previousDocument };

    res.docs = results;

    next();
  };
};
