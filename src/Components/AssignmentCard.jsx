import React, { useState } from "react";
import "../css/contactCard.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const AssignmentCard = ({ con, toFetch, setToFetch }) => {
  const { user } = useSelector((state) => state.auth);

  const handleAccept = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };
    try {
      const data = await axios.get(
        `${BASE_URL}/loans/${con?._id}/approve`,
        config
      );
      if (data) {
        setToFetch(!toFetch);
        toast.success("Assignment Accepted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReject = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };
    try {
      const data = await axios.get(
        `${BASE_URL}/loans/${con?._id}/reject`,
        config
      );
      if (data) {
        toast.success("Assignment Rejected");
        setToFetch(!toFetch);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handlePay = async ({ loan, amount }) => {
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };
    try {
      const data = await axios.post(
        `${BASE_URL}/repayments`,
        { loanId: loan, amount },
        config
      );
      if (data) {
        toast.success("Repayment Paid");
        setToFetch(!toFetch);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="card" key={con?._id}>
      {user?.isAdmin === true && <h5>User: {con?.user?.name}</h5>}
      <h5>amount: {con?.amount}</h5>
      <h5
        className={
          con?.status === "APPROVED"
            ? "pay-approved"
            : con?.status === "PAID"
            ? "pay-paid"
            : "pay-pending"
        }
      >
        Status: {con?.status}
      </h5>

      <h3>term: {con.term}</h3>
      {user?.isAdmin === true && con?.status === "PENDING" && (
        <div>
          <div className="flex">
            <button className="accept" onClick={handleAccept}>
              <FaCheckCircle /> Accept
            </button>
            <button className="reject" onClick={handleReject}>
              <FaTimesCircle /> Reject
            </button>
          </div>
        </div>
      )}

      {user?.isAdmin === false && con?.status === "APPROVED" && (
        <>
          <h5>Repayment data</h5>
          {con?.repayments?.map((repayment) => (
            <div key={repayment?._id} className="due-pay ">
              <h5>Date: {new Date(repayment?.dueDate).toLocaleDateString()}</h5>
              <h5>Amount: {repayment?.amount}</h5>
              <h5
                className={
                  repayment?.status === "PENDING" ? "pay-pending" : "pay-paid"
                }
              >
                Status: {repayment?.status}
              </h5>
              {repayment?.status === "PENDING" && (
                <div>
                  <div className="flex">
                    <button
                      className="accept"
                      onClick={() => handlePay(repayment)}
                    >
                      <FaCheckCircle /> Pay
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AssignmentCard;
