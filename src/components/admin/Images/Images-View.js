import React from "react";
import InputGroup from "../../common/InputGroup";
import ImageUpload from "../../common/Image_Upload/ImageUpload";
import AddButton from "../../ui/Buttons/AddButton";

const ImagesView = ({
  onImageSelected,
  onImageUpload,
  onSubmit,
  data,
  onChange,
  onAddLink
}) => {
  return (
    <div className="tab-pane" id="services" role="tabpanel">
      <div className="row">
        <div className="col-md-12 text-center">
          <h4 className="font-32 tabs-title">Upload Images</h4>
        </div>
          <div className="col-md-12">
          <form id="images" onSubmit={onSubmit}>

            <div
              className="card m-b-30 border-1-gray"
            >
              <div className="card-body">
                <h6 className="text-muted m-t-20">
                  <b>Website Background: </b>
                </h6>
                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="websiteBg"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                />

                <h6 className="text-muted m-t-20">
                  <b>Auth Bg: </b>
                </h6>
                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="authBg"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                />

                <h6 className="text-muted m-t-20">
                  <b>Sponser By: (230px * 200px)</b>
                </h6>
                <ImageUpload
                  type="upload"
                  label="Upload"
                  id="sponsorBy"
                  onChangeImage={onImageSelected}
                  onClick={onImageUpload}
                />

                <h6 className="text-muted m-t-20">
                  <b>Sponsor Link: </b>
                </h6>
                <div className="row">
                  <div className="col-md-9 col-sm-9" style={{marginBottom: "10px"}}>
                    <InputGroup
                      name="sponsorLink"
                      placeholder="Add Sponsor Link here"
                      value={data.sponsorLink}
                      onChange={onChange}
                    />
                  </div>
                  <div className="col-md-3 col-sm-3" style={{textAlign: "end"}}>
                    <AddButton type="button" onClick={onAddLink}>
                      Add Link
                    </AddButton>
                  </div>
                </div>
              </div>
            </div>
            {/* end card */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImagesView;
