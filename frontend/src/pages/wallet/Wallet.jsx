import axios from "axios";
import Confetti from "react-confetti";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiFillDollarCircle, AiFillGift, AiOutlineDollarCircle } from "react-icons/ai";
import { FaRegPaperPlane } from "react-icons/fa";
import "./Wallet.scss";
import mcImg from "../../assets/mc_symbol.png";
import paymentImg from "../../assets/payment.svg";
import { PageMenu }from "../../components/index.js";
import WalletTransactions from "./WalletTransactions";
import TransferModal from "./TransferModal";
import { validateEmail } from "../../redux/features/auth/authService";
import { getUser, selectUser } from "../../redux/features/auth/authSlice";
import DepositModal from "./DepositModal";
import { BACKEND_URL } from "../../utils";
import { RESET_TRANSACTION_MESSAGE, getUserTransactions, selectTransactionMessage,
  selectTransactions, transferFund, verifyAccount } from "../../redux/features/transaction/transactionSlice";

const initialState = {
  amount: 0,
  sender: "",
  receiver: "",
  description: "",
  status: "",
};

const initialDepositState = {
  amount: 0,
  paymentMethod: "",
};

const Wallet = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [deposit, setDeposit] = useState(initialDepositState);
  const [isVerified, setIsVerified] = useState(false);
  const [transferData, setTransferData] = useState(initialState);
  const { amount, receiver, description } = transferData;
  const { amount: depositAmount, paymentMethod } = deposit;
  const transactionMessage = useSelector(selectTransactionMessage);
  const transactionss = useSelector(selectTransactions);
  const user = useSelector(selectUser);
  const { isLoading } = useSelector((state) => state.transaction);
  
  const [urlParams] = useSearchParams();
  const payment = urlParams.get("payment");
  
  useEffect(() => {
    if (payment === "successful") {
      toast.success("Payment successful");
      setTimeout(() => {
        navigate("/wallet");
      }, 5000);
    }
    if (payment === "failed") {
      toast.success("Payment Failed, please try again later");
    }
  }, [navigate, payment]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, user]);

  const closeModal = (e) => {
    if (e.target.classList.contains("cm")) {
      setShowTransferModal(false);
      setShowDepositModal(false);
      setTransferData({ ...initialState });
      setDeposit({ ...initialDepositState });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
    setIsVerified(false);
    dispatch(RESET_TRANSACTION_MESSAGE());
  };
  
  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setDeposit({ ...deposit, [name]: value });
  };

  const transferMoney = async (e) => {
    e.preventDefault();
    if (amount < 1) {
      return toast.error("Please enter a valid amount");
    }
    if (!description) {
      return toast.error("Please enter a description");
    }

    const formData = {
      ...transferData,
      sender: user.email,
      status: "Success",
    };
    await dispatch(transferFund(formData));
    await dispatch(getUser());
  };

  const verifyUserAccount = async () => {
    if (receiver === "") {
      return toast.error("Please add receivers account");
    }
    if (!validateEmail(receiver)) {
      return toast.error("Please add a valid account email");
    }
    const formData = {
      receiver,
    };

    dispatch(verifyAccount(formData));
  };

  useEffect(() => {
    if (transactionMessage === "Account Verification Successful") {
      setIsVerified(true);
    }
    if (transactionMessage === "Transaction successful") {
      setTransferData({ ...initialState });
      setShowTransferModal(false);
    }
    dispatch(RESET_TRANSACTION_MESSAGE());
  }, [transactionMessage, dispatch]);
  
  const getTransac = () => {
    if (user) {
      const formData = {
        email: user.email,
      };
      dispatch(getUserTransactions(formData));
    }
  };
  
  useEffect(() => {
    getTransac();
  }, [dispatch]);

  const makeDeposit = async (e) => {
    e.preventDefault();
    if (deposit.amount < 1) {
      return toast.error("Please enter amount greater than 0");
    }
    if (paymentMethod === "stripe") {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/transaction/depositFundStripe`,
        {
          amount: depositAmount,
        }
      );
      window.location.href = data.url;
      return;
    }
    toast.error("Please select a payment method.");
  };

  return (
    <>
      {payment === "successful" && <Confetti />}
      <section>
        <div className="container">
          <PageMenu />
          <div className="wallet">
            <div className="wallet-data --flex-start --flex-dir-column">
              <div className="wallet-info --card --mr">
                <span>Hello...</span>
                <h4>{user?.name}</h4>
                <hr />
                <span className="--flex-between">
                  <p>Account Balance</p>
                  <img alt="mc" src={mcImg} width={50} />
                </span>
                <h4>₹{user?.balance?.toFixed(2)}</h4>
                <div className="buttons --flex-center">
                  <button
                    className="--btn --btn-primary"
                    onClick={() => setShowDepositModal(true)}
                  >
                    <AiOutlineDollarCircle /> &nbsp; Deposit Money
                  </button>
                  <button
                    className="--btn --btn-danger"
                    onClick={() => setShowTransferModal(true)}
                  >
                    <FaRegPaperPlane /> &nbsp; Transfer
                  </button>
                </div>
              </div>

              <div className="wallet-promo --flex-between --card">
                <div className="wallet-text">
                  <span className="--flex-start">
                    <AiFillDollarCircle size={25} color="#ff7722" />
                    <h4>EchoShop Wallet</h4>
                  </span>
                  <span className="--flex-start">
                    <h4>Cashback up to 80%</h4>
                    <AiFillGift size={20} color="#007bff" />
                  </span>
                  <span>
                    Use your echoshop wallet at checkout and get up to 80%
                    cashback.
                  </span>
                </div>
                <div className="wallet-img">
                  <img src={paymentImg} alt="pay" width={150} />
                </div>
              </div>
            </div>
            {user !== null && (
              <WalletTransactions transactions={transactionss} user={user} />
            )}
          </div>
          {showTransferModal && (
            <TransferModal
              closeModal={closeModal}
              transferData={transferData}
              handleInputChange={handleInputChange}
              handleAccountChange={handleAccountChange}
              onSubmit={transferMoney}
              verifyUserAccount={verifyUserAccount}
              isVerified={isVerified}
              isLoading={isLoading}
            />
          )}
          {showDepositModal && (
            <DepositModal
              closeModal={closeModal}
              handleDepositChange={handleDepositChange}
              onSubmit={makeDeposit}
              deposit={deposit}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Wallet;
