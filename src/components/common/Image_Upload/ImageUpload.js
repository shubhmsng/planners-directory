import React from "react";
import TickIcon from "../../../../src/img/tick.png";
import "../../../styles/UploadImage.css";

import { toast } from "react-toastify";

const ImageUpload = ({
  onClick,
  onChangeImage,
  label,
  disabled,
  type,
  id,
  data,
}) => {


  return (
    <div className="row" style={{ paddingTop: "10px" }}>
      <div className = "col-md-9 col-sm-9" style={{display: "flex", marginBottom: "10px"}}>
      <div
        className="image-show"
        style={{ backgroundImage: "url(" + data + ")" }}
      >
        {/*<img className="image-show" src={data} alt=""/>*/}
      </div>
      <div className="custom-file">
        <input
          type="file"
          onChange={onChangeImage}
          disabled={disabled}
          className="custom-file-input"
          id={id + "i"}
          required
        />

        <label
          id={id + "ilabel"}
          className="custom-file-label"
          for="validatedCustomFile"
        >
          Choose file...
        </label>
        <div className="invalid-feedback">
          Example invalid custom file feedback
        </div>
      </div>
      </div>
      <div className="col-md-3 col-sm-3" style={{marginBottom: "10px", display: "flex", flexDirection: "row-reverse" }}>
        <button
          type={type}
          disabled={disabled}
          id={id}
          onClick={onClick}
          className="btn btn-primary"
        >
          {label}
        </button>

    
      {/* <div >{imagePreview}</div> */}

      {/*<input*/}
      {/*style={{ border: "5px solid black" }}*/}
      {/*type="file"*/}
      {/*id="idofinput"*/}
      {/*className="hidden"*/}
      {/*accept="image/png, image/jpeg"*/}
      {/*onChange={onChange}*/}
      {/*disabled={disabled}*/}
      {/*/>*/}
      {/*<button*/}
      {/*type={type}*/}
      {/*disabled={disabled}*/}
      {/*id={id}*/}
      {/*className="uploadButton"*/}
      {/*onClick={onClick}*/}
      {/*>*/}
      {/*{label}*/}
      {/*</button>*/}
        {data ? (
          <img className="upload-image-tick" src={TickIcon} alt="Tick Icon" />
        ) : null}
      </div>
    </div>
  );
};

export default ImageUpload;
