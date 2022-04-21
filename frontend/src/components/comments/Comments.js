import React, {useEffect, useState} from 'react'
import styles from "./styles.module.css"
import {useDispatch, useSelector} from "react-redux"
import * as api from '../../api/commentsApi.js';
import {isEmpty, isEmail} from '../../utils/validations'
import { formatDate } from '../../utils/formatDate';
import { getComments } from '../../redux/actions/commentActions';

const Comments = ({darkMode, info}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getComments(info._id))
    }, [dispatch, info]);


    const {isLoggedIn, userInfo} = useSelector(state => state.UsersReducer)
    const [replyTo, setReplyTo] = useState('')
    const [parentCom, setParentCom] = useState('')
    const [state, setState] = useState({
        name: "",
        email: "",
        website: "",
        text: "",
        photo: "",
        id: ""
    })
    const [error, setError] = useState("")
    const [index, setIndex] = useState(0)

    const handleChange = (name, value) => {
        if(isLoggedIn) {
            setState({
                text: value,
                id: userInfo._id
            })
        } else {
            setState({
                ...state,
                [name]: value,
                photo: "https://res.cloudinary.com/dxkxeimv4/image/upload/v1645089806/animace/userPhoto/47548e7f026bc689ba743b2af2d391ee_dvbdgu.jpg"
            })
        }
    }

    const handleReply = (name, index, id) => {
        document.getElementById("reply").scrollIntoView({
            block: 'center',
            behavior: "smooth"
        })
        setReplyTo(name)
        setParentCom(id)
        setIndex(index + 1)
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(isLoggedIn) {
            if(isEmpty(state.text)) {
                return setError("Please fill in a required field!")
            }
        } else {
            if(isEmpty(state.email) || isEmpty(state.name) || isEmpty(state.text))
                return setError("Please fill in required fields!")
                
            if(!isEmail(state.email))
                return setError("Please enter a valid email!")
        }
        try {
            setError("")
            const data = {
                author: state,
                index: index,
                parentCom: parentCom,
                postId: info._id,
            }
            console.log(data)
            const res = await api.addComment(data)
            if(res.data) {
                console.log(res.data)
                setState({
                    name: "",
                    email: "",
                    website: "",
                    text: "",
                    photo: ""
                })
                setReplyTo('')
                setIndex(0)
                setParentCom('')
            }
        } catch (err) {
            setError(err.response.data.msg)
        }
    }

    const cancelReply = () => {
        setReplyTo('')
        setIndex(0)
        setParentCom('')
    }

  return (
    <>
        <div className={styles.line}></div>
            {
            info.comments?.length !== 0 ?
            <div className={styles.commentsArea}>
            <div className={styles.CommentsHeader}>{info.comments?.length} comments</div>
            {
            info.comments?.map(item => {
                console.log(item)
                return (
                    <div 
                    style={{"marginLeft": item.index * 40 + "px"}} 
                    className={styles.Comment}
                    >
                        {
                            item.author ? 
                            <>
                                <img alt='a' src={item.author?.file} />
                                <div style={darkMode ? {"backgroundColor": "#323232"} : {}} className={styles.CommentArea}>
                                    <div>{`${item.author?.name} ${item.author?.surname} - ${formatDate(item.createdAt)}`}</div>
                                    <button onClick={() => handleReply(`${item.author.name} ${item.author.surname}`,  item.index, item._id)}>Reply</button>
                                    <div>{item.text}</div>
                                </div>
                            </>
                            : 
                            <>
                                <img alt='a' src="https://res.cloudinary.com/dxkxeimv4/image/upload/v1645089806/animace/userPhoto/47548e7f026bc689ba743b2af2d391ee_dvbdgu.jpg" />
                                <div style={darkMode ? {"backgroundColor": "#323232"} : {}} className={styles.CommentArea}>
                                    <div>{`${item.name} - ${formatDate(item.createdAt)}`}</div>
                                    <button onClick={() => handleReply(item.name, item.index, item._id)}>Reply</button>
                                    <div>{item.text}</div>
                                </div>
                            </>
                        }
                    </div>
                )
            })
            }
            </div> : ""
        }
        <div id="reply" className={styles.leaveReplyArea}>
        <span className={styles.leaveReplyHeader}>Leave a Reply</span>
        {replyTo !== '' ? <>
            <span className={styles.leaveReplyHeader}> to {replyTo}</span>
            <span onClick={() => cancelReply()} className={styles.cancelReply}> Cancel Reply</span> </>: ""}

        {isLoggedIn ? <>
        <div className={styles.leaveReplyWarner}>
            Logged in as {`${userInfo.name} ${userInfo.surname}`}. Required fields are marked *
        </div> 
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor='text'>Comment *</label>
            <textarea 
                className={styles.leaveReplyTextarea} 
                value={state.text} 
                onChange={(e) => handleChange(e.target.name, e.target.value)}  
                name='text'
                type="text" 
                id='text'
            ></textarea>
            <button className={styles.postButt} type='submit'>Post Comment</button>
        </form>
        </>
        :
        <>
        <div className={styles.leaveReplyWarner}>
            Your email address will not be published. Required fields are marked *
        </div>
        {error && <div className={styles.error}>{error}</div>} 
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.nameAndEmailArea}>
            <div>
                <label htmlFor='name'>Name *</label>
                <input 
                    className={styles.leaveReplyInput} 
                    value={state.name} 
                    onChange={(e) => handleChange(e.target.name, e.target.value)}  
                    name='name' 
                    type="text" 
                    id='name' 
                />
            </div>
            <div>
            <label htmlFor='email'>Email *</label>
            <input 
                className={styles.leaveReplyInput} 
                value={state.email} 
                onChange={(e) => handleChange(e.target.name, e.target.value)}  
                name='email' 
                type="text" 
                id='email'  
            />
            </div>
            </div>
            <label htmlFor='website'>Website</label>
            <input 
                className={styles.leaveReplyInput} 
                value={state.website} 
                onChange={(e) => handleChange(e.target.name, e.target.value)}  
                name='website' 
                type="text" 
                id='website'  
            />
            <label htmlFor='text'>Comment *</label>
            <textarea 
                className={styles.leaveReplyInput} 
                value={state.text} 
                onChange={(e) => handleChange(e.target.name, e.target.value)}  
                name='text' 
                type="text" 
                id='text' 
            ></textarea>
            <button className={styles.postButt} type='submit'>Post Comment</button>
        </form>
        </>}
        </div>
    </>
  )
}

export default Comments