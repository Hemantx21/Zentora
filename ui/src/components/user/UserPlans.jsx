import axios from '../../api'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2'
const UserPlans = () => {
  const [data, setData] = useState([])
  const [credits, setCredits] = useState(0)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    const info = JSON.parse(localStorage.getItem('info') || '{}')
    const [plansRes, statsRes] = await Promise.all([
      axios.get('/admin-get-plans'),
      info?._id
        ? axios.get(`/user-stats?userId=${info._id}`)
        : Promise.resolve(null)
    ])
    setData(plansRes?.data?.result || [])
    setCredits(Number(statsRes?.data?.result?.credits) || 0)
  }
  const handlePurchasePlan = async (item) => {
    const info = JSON.parse(localStorage.getItem('info') || '{}')
    const userId = info?._id;
    const planId = item?._id;
    if (!userId) {
      await Swal.fire({
        title: "Sign in required",
        text: "Please sign in to add plan credits.",
        icon: "info"
      })
      return
    }
    const confirmation = await Swal.fire({
      title: `Get ${item?.name} credits?`,
      text: `${item?.credits} credits for ₹${item?.price}. This development checkout does not process a payment.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    })
    if (!confirmation.isConfirmed) return

    try {
      const res = await axios.post('/user-purchase-plan', { planId, userId })
      if (res?.data?.success) {
        await fetchData()
        await Swal.fire({
          title: "Credits added",
          text: res?.data?.message,
          icon: "success"
        })
      } else {
        await Swal.fire({
          title: "Plan",
          text: res?.data?.message || "Could not add plan credits.",
          icon: "error"
        })
      }
    } catch (error) {
      await Swal.fire({
        title: "Plan",
        text: error?.response?.data?.message || "Could not connect to the server. Please try again.",
        icon: "error"
      })
    }
  }

  return (
    <section className="pricing-section section-pad">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center">
              <p className="eyebrow">MY PLAN &amp; CREDITS</p>
              <h2 className="section-title">
                My Plan &amp; Bidding <span className="underline-word">Credits</span>
              </h2>
              <p className="section-sub">
                Purchase a plan to get monthly credits. Each bid on a project costs <strong>1 credit</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="dash-plan-banner text-center mb-0">
              <strong>Credits available:</strong> {credits} · <strong>1 credit = 1 bid</strong>
            </div>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {data.length === 0 && (
            <div className="col-12 text-center">
              <p className="text-secondary">
                No credit plans are available yet. Please ask an administrator to add a plan.
              </p>
            </div>
          )}
          {data?.map((item) => {
            return (<div key={item?._id} className="col-12 col-sm-6 col-lg-4">
              <div className="pricing-card popular h-100">
                {item?.popular && <span className="popular-badge">Most Popular</span>}

                <div className="pricing-card-top">
                  <h4>{item?.name}</h4>
                  <p className="plan-price">
                    ₹{item?.price} <span>/ month</span>
                  </p>
                  <p className="plan-desc">{item?.tagline}</p>
                  <ul className="plan-features list-unstyled">
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>{item?.credits} bidding credits / month</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Browse all open projects</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Enhanced portfolio profile</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Priority bid visibility</span>
                    </li>
                    <li className="off">
                      <FaTimes className="feat-icon" />
                      <span>Bid analytics dashboard</span>
                    </li>
                  </ul>
                </div>
                <div className="pricing-card-bottom">
                  <button onClick={() => handlePurchasePlan(item)} type="button" className="plan-btn plan-btn-solid">
                    Get Plan
                  </button>
                  <p className="plan-footer">{item?.credits} credits · 1 credit per bid</p>
                </div>
              </div>
            </div>)
          })}

          {/* PRO */}



        </div>
      </div>
    </section>
  )
}

export default UserPlans
