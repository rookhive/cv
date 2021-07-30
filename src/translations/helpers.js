export const getAge = birthDate => {
  const nowTS = Date.now()
  const birthTS = new Date(birthDate).valueOf()
  return new Date(nowTS - birthTS).getFullYear() - 1970
}
