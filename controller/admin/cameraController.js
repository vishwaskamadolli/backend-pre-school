const Camera = require('../../model/admin/cameraModel');

// @desc Add new camera
// @route POST /api/admin/cameras
exports.addCamera = async (req, res) => {
  try {
    const { name, location, streamUrl } = req.body;

    if (!name || !location || !streamUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCamera = await Camera.create({ name, location, streamUrl });
    res.status(201).json(newCamera);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add camera', error });
  }
};

// @desc Get all cameras
// @route GET /api/admin/cameras
exports.getCameras = async (req, res) => {
  try {
    // Remove .populate('assignedTo', 'name email')
    const cameras = await Camera.find();
    res.status(200).json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ message: 'Failed to fetch cameras', error: error.message });
  }
};

exports.getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.status(200).json(camera);
  } catch (error) {
    console.error('Error fetching camera by ID:', error);
    res.status(500).json({ message: 'Failed to fetch camera', error: error.message });
  }
};

exports.updateCamera = async (req, res) => {
  try {
    const { name, location, streamUrl, status } = req.body;

    // Validate required fields
    if (!name || !location || !streamUrl || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedCamera = await Camera.findByIdAndUpdate(
      req.params.id,
      { name, location, streamUrl, status },
      { new: true, runValidators: true }
    );

    if (!updatedCamera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.status(200).json({ message: 'Camera updated successfully', camera: updatedCamera });
  } catch (error) {
    console.error('Error updating camera:', error);
    res.status(500).json({ message: 'Failed to update camera', error: error.message });
  }
};


// @desc Delete camera
// @route DELETE /api/admin/cameras/:id
exports.deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.status(200).json({ message: 'Camera deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete camera', error });
  }
};

// @desc Assign camera to user/child
// @route PUT /api/admin/cameras/:id/assign
exports.assignCamera = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const camera = await Camera.findById(req.params.id);

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    camera.assignedTo = assignedTo;
    await camera.save();

    res.status(200).json({ message: 'Camera assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign camera', error });
  }
};
