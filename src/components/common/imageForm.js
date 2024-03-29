import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";

class ImageForm extends React.Component {
  state = {
    data: {},
  };

  onImageSelected = (e) => {
    let name = e.target.files[0].name;

    let img = new Image();

    img.src = window.URL.createObjectURL(e.target.files[0]);

    let c = e.target.files[0];
    let id = e.target.id;

    img.onload = (x = 0, y = c, i = id) => {
      if (img.width >= 1040 && img.height >= 800) {
        console.info();
        console.info();

        let label = document.getElementById(id + "label");

        label.innerHTML = name;
        this.setState({
          data: {
            ...this.state.data,
            selectedFile: y,
            selected: true,
          },
        });
      } else {
        toast.warn("Image size should be at least 1040 * 800.");
      }
    };
  };

  onImageUpload = (e) => {
    e.preventDefault();
    const { selected } = this.state.data;
    if (!selected) {
      toast.warn("Please Select a image to upload");
    } else {
      this.setState({ data: { ...this.state.data, loading: true } });
      let id = e.target.id;
      const httpClient = axios.create();
      httpClient.defaults.timeout = 30000;
      const formData = new FormData();
      formData.append(id, this.state.data.selectedFile);

      httpClient
        .post(`/api/image-upload/${id}`, formData)
        .then((res) => this.onSuccess(res, id))
        .catch((err) => this.onFailure(err));
    }
  };

  onSuccess = (res, id) => {
    toast.success("Image Uploaded Successfully");
    this.setState(
      {
        data: {
          ...this.state.data,
          [id]: res.data.imageUrl,
          selectedFile: {},
          loading: false,
        },
      },
      () => {
        if (id !== "noticeboard") this.onSubmit();
      }
    );
  };

  onFailure = (err) => {
    this.setState({
      data: { ...this.state.data, selectedFile: {}, loading: false },
    });
    toast.error("Failed to Upload Image. Exceeded Time Duration");
  };
}

export default ImageForm;
