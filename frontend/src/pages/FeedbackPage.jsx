import { useState } from 'react';
import { useMutation,useQuery, } from '@tanstack/react-query';
import toast from "react-hot-toast";
import {submitFeedback,  getMyFeedbacks} from '../api/feedbackApi';


const FeedbackPage = () => {
  const [subject, setSubject] =
    useState('');

  const [message, setMessage] =
    useState('');

  const mutation = useMutation({
  mutationFn: submitFeedback,

  onSuccess: () => {
    setSubject("");
    setMessage("");

    toast.success("Feedback submitted successfully!");
  },

  onError: () => {
    toast.error("Unable to submit feedback.");
  },
});
const {
  data: feedbacks = [],
} = useQuery({
  queryKey: ['myFeedbacks'],
  queryFn: getMyFeedbacks,
});

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

      <h1 className="text-3xl font-bold">
        Feedback & Suggestions
      </h1>

      <p className="mt-2 text-slate-500">
        Help us improve HealthOS.
      </p>

      <div className="mt-6 space-y-4">

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          className="w-full rounded-xl border border-slate-200 p-3"
        />

        <textarea
          rows={6}
          placeholder="Your suggestion..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="w-full rounded-xl border border-slate-200 p-3"
        />

        <button
          onClick={() =>
            mutation.mutate({
              subject,
              message,
            })
          }
          className="rounded-xl bg-brand-500 px-5 py-3 text-white"
        >
          Submit Feedback
        </button>
        {mutation.isSuccess && (
  <p className="text-green-600">
    Feedback submitted successfully.
  </p>
)}

      </div>
      <hr className="my-8" />

<h2 className="text-2xl font-bold">
  My Feedback History
</h2>

<div className="mt-4 space-y-4">

  {feedbacks.map((item) => (

    <div
      key={item._id}
      className="rounded-xl border border-slate-200 p-4"
    >

      <h3 className="font-bold text-lg">
        {item.subject}
      </h3>

      <p className="mt-2">
        Status:
        <span
          className={`ml-2 rounded-full px-3 py-1 text-sm ${
            item.status === 'reviewed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {item.status}
        </span>
      </p>

      <p className="mt-3">
        <strong>
          Your Message:
        </strong>
      </p>

      <p>
        {item.message}
      </p>

      {item.adminReply && (
        <div className="mt-4 rounded-lg bg-green-50 p-3">

          <strong>
            Admin Reply:
          </strong>

          <p>
            {item.adminReply}
          </p>

        </div>
      )}

    </div>

  ))}

</div>

    </div>
  );
};

export default FeedbackPage;