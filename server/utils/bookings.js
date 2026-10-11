export const generateBookingReference = () => {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);

  const randomNumber = 10000 + (randomBuffer[0] % 90000);

  return `Ref: #HF-${randomNumber}`;
};
