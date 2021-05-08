import React from "react";
import EditButton from "../../ui/Buttons/EditButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import Spinner from "../../common/Spinner/Spinner";
import ImageUpload from "../../common/Image_Upload/ImageUpload";

const UploadImagesView = ({
  data,
  onClickEdit,
  onImageSelected,
  onImageUpload,
  onSubmit,
  t
}) => {
  return (
    <div className="tab-pane" id="services" role="tabpanel">
      <div className="row" style={{ paddingTop: "1rem" }}>
        <div className="col-md-12 text-center">
          <h4 className="font-32 tabs-title">{t.uploadImage}</h4>
        </div>
      </div>
      <form id="images text-center" onSubmit={onSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-warning">
              <strong>{`${t.warning}!`}</strong> {t.uploadImageWarnings}
            </div>
          </div>

          <div className="col-md-12">
            <div
              className="card m-b-30 border-1-gray"
            >
              <div className="card-body">
                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="image1"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                  data={data.image1}
                />

                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="image2"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                  data={data.image2}
                />

                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="image3"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                  data={data.image3}
                />

                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="image4"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                  data={data.image4}
                />

                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="image5"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                  data={data.image5}
                />
              </div>
            </div>
            {/* end card */}
          </div>
        </div>
      </form>
      {/* <div className="bd-top" />
      <div className="osr-btn-group p-b-15  text-center">
        <SaveButton label="Save" form="images" type="save" onClick={onSubmit} />
        <CancelButton label="Cancel" onClick={onClickEdit} type="cancel" />
      </div> */}


  {/* <img src={this.state.file} onLoad={() => console.log("loaded")} />; */}

    </div>
  );
};

export default UploadImagesView;
