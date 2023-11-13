const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);

async function loadDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/project7", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
    });

    const models = require("./modelData/photoApp.js").models;
    const User = require("./schema/user.js");
    const Photo = require("./schema/photo.js");
    const SchemaInfo = require("./schema/schemaInfo.js");

    const versionString = "1.0";

    // Remove existing data
    await Promise.all([User.deleteMany({}), Photo.deleteMany({}), SchemaInfo.deleteMany({})]);

    // Load users
    const userModels = models.userListModel();
    const mapFakeId2RealId = {};

    for (const user of userModels) {
      try {
        const userObj = await User.create({
          first_name: user.first_name,
          last_name: user.last_name,
          location: user.location,
          description: user.description,
          occupation: user.occupation,
        });
        userObj.save();
        mapFakeId2RealId[user._id] = userObj._id;
        user.objectID = userObj._id;
        console.log(
          "Adding user:",
          user.first_name + " " + user.last_name,
          " with ID ",
          user.objectID
        );
      } catch (err) {
        console.error("Error creating user", err);
      }
    }

    // Load photos
    const photoModels = [];
    const userIDs = Object.keys(mapFakeId2RealId);
    userIDs.forEach((id) => {
      photoModels.push(...models.photoOfUserModel(id));
    });

    for (const photo of photoModels) {
      try {
        const photoObj = await Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: mapFakeId2RealId[photo.user_id],
        });

        photo.objectID = photoObj._id;

        if (photo.comments) {
          photo.comments.forEach((comment) => {
            photoObj.comments = photoObj.comments.concat([
              {
                comment: comment.comment,
                date_time: comment.date_time,
                user_id: comment.user.objectID,
              },
            ]);
            console.log(
              "Adding comment of length %d by user %s to photo %s",
              comment.comment.length,
              comment.user.objectID,
              photo.file_name
            );
          });
        }

        photoObj.save();
        console.log("Adding photo:", photo.file_name, " of user ID ", photoObj.user_id);
      } catch (err) {
        console.error("Error creating photo", err);
      }
    }

    // Create SchemaInfo object
    await SchemaInfo.create({
      version: versionString,
    });

    console.log("SchemaInfo object created with version ", versionString);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  } finally {
    mongoose.disconnect();
  }
}

loadDatabase();
