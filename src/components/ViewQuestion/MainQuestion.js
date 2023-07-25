import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFillBookmarksFill } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import "draft-js/dist/Draft.css";
import { Editor, EditorState } from "draft-js";
import axios from "axios";
import HtmlReactParser from "html-react-parser";
import { Link } from "react-router-dom";
import "./index.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../feature/userSlice";
import { stringAvatar } from "../../utils/Avatar";

function MainQuestion() {
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [
      { color: ["#ff0000", "#00ff00", "#0000ff", "#220055"] },
      { background: [] },
    ], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  Editor.modules = {
    syntax: false,
    toolbar: toolbarOptions,
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  Editor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  let search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("q");

  const [questionData, setQuestionData] = useState();
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  // const [comments, setComments] = useState([]);
  const user = useSelector(selectUser);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {
    async function getFunctionDetails() {
      await axios
        .get(
          `https://stackoverflowclone-backend-mii4.onrender.com/api/question/${id}`
        )
        .then((res) => setQuestionData(res.data[0]))
        .catch((err) => console.log(err));
    }
    getFunctionDetails();
  }, [id]);

  async function getUpdatedAnswer() {
    await axios
      .get(
        `https://stackoverflowclone-backend-mii4.onrender.com/api/question/${id}`
      )
      .then((res) => setQuestionData(res.data[0]))
      .catch((err) => console.log(err));
  }

  // console.log(questionData);
  const handleSubmit = async () => {
    const body = {
      question_id: id,
      answer: answer,
      user: user,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios
      .post(
        "https://stackoverflowclone-backend-mii4.onrender.com/api/answer",
        body,
        config
      )
      .then(() => {
        alert("Answer added successfully");
        setAnswer("");
        getUpdatedAnswer();
      })
      .catch((err) => console.log(err));
  };

  const handleComment = async () => {
    if (comment !== "") {
      const body = {
        question_id: id,
        comment: comment,
        user: user,
      };
      await axios
        .post(
          `https://stackoverflowclone-backend-mii4.onrender.com/api/comment/${id}`,
          body
        )
        .then((res) => {
          setComment("");
          setShow(false);
          getUpdatedAnswer();
          // console.log(res.data);
        });
    }

    // setShow(true)
  };
  return (
    <div className="main">
      <div className="main-container">
        <div className="main-top">
          <h2 className="main-question">{questionData?.title} </h2>
          <Link to="/add-question">
            <button>Ask Question</button>
          </Link>
          {/* <a href="/add-question">
            <button>Ask Question</button>
          </a> */}
        </div>
        <div className="main-desc">
          <div className="info">
            <p>
              Asked
              <span>{new Date(questionData?.created_at).toLocaleString()}</span>
            </p>
            <p>
              Active<span>today</span>
            </p>
            <p>
              Viewed<span>43times</span>
            </p>
          </div>
        </div>
        <div className="all-questions">
          <div className="all-questions-container">
            <div className="all-questions-left">
              <div className="all-options">
                <p className="arrow">▲</p>

                <p className="arrow">0</p>

                <p className="arrow">▼</p>

                <BsFillBookmarksFill w={6} h={6} color="blue.500" />

                <BiHistory />
              </div>
            </div>
            <div className="question-answer">
              <p>{HtmlReactParser(questionData?.body)}</p>

              <div className="author">
                <small>
                  asked {new Date(questionData?.created_at).toLocaleString()}
                </small>
                {/* <div className="auth-details">
                  <Avatar/>
                  <p>
                    {questionData?.user?.displayName
                      ? questionData?.user?.displayName
                      : "Natalia lee"}
                  </p>
                </div> */}
              </div>
              <div className="comments">
                <div className="comment">
                  {questionData?.comments &&
                    questionData?.comments.map((_qd) => (
                      <p key={_qd?._id}>
                        {_qd.comment}{" "}
                        <span>
                          - {_qd.user ? _qd.user.displayName : "Nate Eldredge"}
                        </span>{" "}
                        {"    "}
                        <small>
                          {new Date(_qd.created_at).toLocaleString()}
                        </small>
                      </p>
                    ))}
                </div>
                <p onClick={() => setShow(!show)}>Add a comment</p>
                {show && (
                  <div className="title">
                    <textarea
                      style={{
                        margin: "5px 0px",
                        padding: "10px",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        borderRadius: "3px",
                        outline: "none",
                      }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      placeholder="Add your comment..."
                      rows={5}
                    />
                    <button
                      onClick={handleComment}
                      style={{
                        maxWidth: "fit-content",
                      }}
                    >
                      Add comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            flexDirection: "column",
          }}
          className="all-questions"
        >
          <p
            style={{
              marginBottom: "20px",
              fontSize: "1.3rem",
              fontWeight: "300",
            }}
          >
            {questionData && questionData?.answerDetails.length} Answers
          </p>
          {questionData?.answerDetails.map((_q) => (
            <>
              <div
                style={{
                  borderBottom: "1px solid #eee",
                }}
                key={_q._id}
                className="all-questions-container"
              >
                <div className="all-questions-left">
                  <div className="all-options">
                    <p className="arrow">▲</p>

                    <p className="arrow">0</p>

                    <p className="arrow">▼</p>

                    <BsFillBookmarksFill />

                    <BiHistory />
                  </div>
                </div>
                <div className="question-answer">
                  {HtmlReactParser(_q.answer)}
                  <div className="author">
                    <small>
                      asked {new Date(_q.created_at).toLocaleString()}
                    </small>
                    {/* <div className="auth-details">
                      <Avatar
                        src={stringAvatar(user?.name)}
                        alt={user?.name}
                        size="sm"
                      />
                      <p>
                        {_q?.user?.displayName
                          ? _q?.user?.displayName
                          : "Natalia lee"}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="main-answer">
        <h3
          style={{
            fontSize: "22px",
            margin: "10px 0",
            fontWeight: "400",
          }}
        >
          Your Answer
        </h3>

        <Editor
          editorState={editorState}
          value={answer}
          modules={Editor.modules}
          className="react-quill"
          onChange={handleEditorChange}
          placeholder="Enter your answer"
          style={{ minHeight: "200px" }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "100px",
          maxWidth: "fit-content",
        }}
      >
        Post your answer
      </button>
    </div>
  );
}

export default MainQuestion;
