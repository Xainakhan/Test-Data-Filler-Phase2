(() => {
  const { digits } = TF.random;

  const slug = (value) => value.toLowerCase().replace(/[^a-z]/g, "");

  // Country-independent login details derived from a person's Latin name.
  function account({ firstName, lastName }) {
    const handle = `${slug(firstName.latin)}.${slug(lastName.latin)}${digits(2)}`;
    return {
      username: handle,
      email: `${handle}@example.com`,
      password: `Test@${digits(6)}`,
      website: `https://www.example.com/${handle}`,
    };
  }

  TF.generic.account = account;
})();
