const Roles = require('../models/yombo/roleSchema.js'); // Adjust path as necessary

const createRoles = async () =>{
  // Initialize the roles object
  const roles = new Roles()
   // Log the highlight object before saving
   console.log("Roles object to be saved:", roles);

    // Save the rolesto the database
    const savedRoles = await roles.save();

     // Log the saved roles
   //  console.log("Roles saved successfully:", savedRoles);
}








// Delete All Roles
const deleteRoles = async () => {
  try {
  await Roles.deleteMany({}); // Deletes all documents in the Highlight collection

   console.log("All Roles deleted successfully.");
    
  } catch (error) {
    console.log("Error deleting roles:", error);
   
  }
};

//deleteRoles();

//createRoles();



/**
 * Handles HTTP requests to retrieve default roles.
 */
const getDefaultRoles = async (req, res) => {
  try {
    console.log('it racghes here to find default roles')
    const roles = await fetchDefaultRoles();
    //const jumuiya = await fetchJumuiyaRoles();
    if (roles.length === 0) {
      return res.status(404).send({ message: 'Default roles not found' });
    }

    res.status(200).send({
      message: 'Default roles retrieved successfully',
      roles,
    
    });
  } catch (err) {
    console.error('Error retrieving default roles:', err);
    res.status(500).send({
      message: 'An error occurred while retrieving default roles',
      error: err.message,
    });
  }
};

/**
 * Utility function to fetch default roles from the database.
 * @returns {Promise<Array>} Resolves with the roles array or an empty array if not found.
 * @throws {Error} If there is an issue with the database query.
 */
const fetchDefaultRoles = async () => {
  try {
    const rolesDocument = await Roles.findOne();

    if (!rolesDocument){
      console.warn('No default roles document found in the database.');
      return [];
    }

    console.log(rolesDocument.roles);

    return rolesDocument.roles;
  } catch (err) {
    console.error('Error retrieving default roles:', err);
    throw new Error('Failed to fetch default roles from the database');
  }
};

//fetchRoles();
/**
 * Handles HTTP requests to add a new role to the default roles.
 */
const addNewRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate input
    if (!role || typeof role !== 'string' || role.trim() === '') {
      return res.status(400).send({ message: 'Invalid role provided' });
    }

    // Trim and normalize the role
    const trimmedRole = role.trim();

    // Fetch the current roles
    const rolesDocument = await Roles.findOne();

    if (!rolesDocument) {
      return res.status(404).send({ message: 'Default roles document not found' });
    }

    // Check if the role already exists
    if (rolesDocument.roles.includes(trimmedRole)) {
      return res.status(400).send({ message: 'Role already exists' });
    }

    // Add the new role to the roles array
    rolesDocument.roles.push(trimmedRole);
    let leader = `kiongozi_${trimmedRole}`;
    rolesDocument.roles.push(leader);

    // Save the updated document
    await rolesDocument.save();

    res.status(200).send({
      message: 'New role added successfully',
      roles: rolesDocument.roles,
    });
  } catch (err) {
    console.error('Error adding new role:', err);
    res.status(500).send({
      message: 'An error occurred while adding the new role',
      error: err.message,
    });
  }
};

module.exports = {
  getDefaultRoles,
  fetchDefaultRoles,
  addNewRole,
};
