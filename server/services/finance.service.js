import * as financeRepository from "../repositories/finance.repository.js";

const REQUIRED_HOSTEL_FEE = 5000;

export const verifyHostelPayment = async (admissionNumber) => {
  const totalPaid =
    await financeRepository.getHostelPaymentTotal(admissionNumber);

 
  if (totalPaid < REQUIRED_HOSTEL_FEE) {
    throw createError({
      statusCode: 403,
      statusMessage: "HOSTEL_PAYMENT_INCOMPLETE",
    });
  }

  return {
    eligible: true,
    totalPaid,
    requiredAmount: REQUIRED_HOSTEL_FEE,
  };
};
