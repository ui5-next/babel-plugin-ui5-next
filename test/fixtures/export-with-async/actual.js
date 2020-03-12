const fetchCurrentUserInformation = async () => {
  var res = await fetch("/api/v1/user/");
  var body = await res.json();
  return body;
};

export { fetchCurrentUserInformation };