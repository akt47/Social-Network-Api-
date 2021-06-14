const { User, Thought } = require('../models');

const userController = {
  // the functions will go in here as methods

  // get all users will serves as the call backfunction for the GET /api 
  getUsers(req, res) {
    User.find({})
      .then(dbUserData => 
        res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id 
  getUserById   (req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((dbUserData) => {
          // If no user id found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: 'User ID is false.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
    // Create a  user will handle the post/api
    createUser(req, res) {
        User.create(req.body)
          .then(dbUserData => 
            res.json(dbUserData))
          .catch(err => res.status(400).json(err));
      },

        // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, body,
      { new: true, runValidators: true,}
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User with ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
   // delete user and their thoughts
   deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user with ID!' });
        }

        // get user id and delete their thoughts
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: 'User and thoughts deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'User with this ID does not exist.' });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // Remove a friend
  removeFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, 
    { $pull: { friends: req.params.friendId } }, 
    { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'User with this ID does not exist.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};

module.exports = userController;