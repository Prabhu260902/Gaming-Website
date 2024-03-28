const { Router } = require("express");
const router = Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { Getsudoku, Getblock, Gettictactoe, Getsnake, Getchess, Posttictactoe, Postchess, Postsnake, Postsudoku, Postblock } = require("../controllers/gamecontroller");



router.get("/sudoku", requireAuth , Getsudoku)
router.get("/block",requireAuth , Getblock)
router.get("/tictactoe",requireAuth, Gettictactoe)
router.get('/snake',requireAuth, Getsnake)
router.get('/chess',requireAuth, Getchess)


router.post('/tictactoe',requireAuth , Posttictactoe);
router.post('/chess',requireAuth , Postchess);
router.post('/snake',requireAuth, Postsnake)
router.post("/sudoku",requireAuth, Postsudoku)
router.post("/block",requireAuth, Postblock)


module.exports = router;