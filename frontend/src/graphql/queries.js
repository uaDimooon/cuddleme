export const SEND_MESSAGE = `
  mutation HandleNaturalRequest($message: String!) {
    handleNaturalRequest(input: $message)
  }
`;
