// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

// GET REQUEST
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// HEAD REQUEST
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// displays data to users, will be updated for card information display
// get request
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// head request for users
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

// handles 404 and errors or wrong urls, get request
const notReal = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };
  respondJSON(request, response, 404, responseJSON);
};

// head request for 404
const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

// update for task management
// adds tasks to task list, checks for all cases will be updated to better reflect application
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Task and date are both required!',
  };

  // there is no need for check description?
  // ill add it in for now but later might remove for checking since some tasks dont have one
  if (!body.task || !body.description || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201; // created

  // updates task if already exists
  if (users[body.task]) {
    responseCode = 204; // updated
  } else { // creates new task
    users[body.task] = {};
    users[body.task].task = body.task;
  }

  users[body.task].description = body.description;
  users[body.task].date = body.date;
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};
/* Check this out for card creation in JS
https://stackoverflow.com/questions/54706080/generating-dynamic-html-cards-from-a-javascript-array */
module.exports = {
  getUsers,
  getUsersMeta,
  notReal,
  notRealMeta,
  addUser,
};
