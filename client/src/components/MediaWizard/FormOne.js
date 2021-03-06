import React, {useState, useEffect, useRef, useContext} from 'react';
import AppContext from './Context';
import { getNotAvailable } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFileVideo, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import './styles.css';

const FormOne = () => {
    const [notAvailable, setNotAvailable] = useState(null)
    let myContext = useContext(AppContext);
    let updateContext = myContext.fileDetails;

    const fetch = async () => {
        let notAvailable = await getNotAvailable()
    
        return { notAvailable }
      }

    useEffect(() => {
    
        fetch().then(response => {
          setNotAvailable(response.notAvailable)
        })
          return () => {
            setNotAvailable(null)
          }
      }, [])

    const changeSelection = (item) => {
        //alert(JSON.stringify(item))
        updateContext.setSelectedFile(item)
        console.log(updateContext.selectedFile)
        next()
    }
    
    const next = (item) => {
        //if (updateContext.selectedFile) {

            if (item.fs_path == null) {
                console.log('Please choose a file')
            } else {
                console.log(JSON.stringify(item))
                updateContext.setSelectedFile(item)
                updateContext.setStep(prevStep => prevStep + 1)
            }
        //}
        
    };

    console.log(JSON.stringify(updateContext))
    return (
        <div className="contain">
            <p>Choose a file</p>
            <form className="form">
                <div className="tab">
                    {notAvailable && notAvailable.map(item => (
                    <button type="button" key={item.id} onClick={() => next(item)}>
                        <span className="icon">
                        {item.type == 'Movie' || item.type == 'Episode'? <FontAwesomeIcon icon={faFileVideo}/> : null}
                        {item.type == 'Song'? <FontAwesomeIcon icon={faFileAudio}/> : null}
                        </span>
                        {item.fs_path}
                    </button>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default FormOne;