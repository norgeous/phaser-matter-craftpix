export const getCharacterByMatterPartId = (scene, targetId) => scene
  .matter
  .getMatterBodies()
  .find(body => {
    if (body.parts.some(({ id }) => id === targetId)) return body;
    return false;
  })
  ?.gameObject;
