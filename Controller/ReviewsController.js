const ReviewServices = require("../Services/ReviewServices");

class ReviewsController {

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        const result = await ReviewServices.updateReview(id, data);
        return res.status(result.status).json(result);
    }

    async delete(req, res) {
        const { id } = req.params;

        const result = await ReviewServices.deleteReview(id);
        return res.status(result.status).json(result);
    }
}

module.exports = new ReviewsController();
