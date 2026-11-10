(() => {
  const { pick } = TF.random;
  const { toPair } = TF.generic;

  // Each entry: "Name" or ["Latin", "Native"].
  function create({ male, female, last }) {
    const firstName = (gender = pick(["male", "female"])) => ({
      ...toPair(pick(gender === "male" ? male : female)),
      gender,
    });

    const lastName = () => toPair(pick(last));

    return { firstName, lastName };
  }

  TF.generic.names = { create };
})();
