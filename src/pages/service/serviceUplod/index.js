import { useState, useEffect, useContext } from "react";
import { postData, editData, fetchDataFromApi } from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { MyContext } from "../../../App";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { MenuItem, Select } from "@mui/material";

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800],

  height: theme.spacing(3),
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightRegular,

  "&:hover, &:focus": {
    backgroundColor: emphasize(
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
      0.06
    ),
  },

  "&:active": {
    boxShadow: theme.shadows[1],
    backgroundColor: emphasize(
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
      0.12
    ),
  },
}));
const ServiceUpload = () => {

  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    icon: "",
    title: "",
    subtitle: "",
    bg: ""
  });

  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/services/${id}`).then((res) => {
        setFormFields(res.data);
      });
    }
  }, [id]);

  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.title) {
      return context.setAlertBox({
        open: true,
        error: true,
        msg: "Title required"
      });
    }

    if (isEdit) {
      editData(`/api/services/${id}`, formFields).then(() => {
        navigate("/serviceList");

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Service updated"
        });
      });
    } else {
      postData("/api/services", formFields).then(() => {
        navigate("/serviceList");

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Service created"
        });
      });
    }
  };

  return (
    <div className="right-content w-100">

    
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">{isEdit ? "Edit Service" : "Add Service"}</h5>
      <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                                   
                                   <StyledBreadcrumb
                                     component="a"
                                     href="#"
                                     label="Dashboard"
                                     icon={<HomeIcon fontSize="small" />}
                                   />
                               
                                           <StyledBreadcrumb
                                                component="a"
                                               label="Services"
                                                href="#"
                                     deleteIcon={<ExpandMoreIcon />}
                                           />
                                           
                                           <StyledBreadcrumb
                                               label="Service Upload"
                                     deleteIcon={<ExpandMoreIcon />}
                                   />
                               
                                 </Breadcrumbs>
     
          </div>

      <form onSubmit={handleSubmit} className="form" >
    <div className="card p-4">
        <div className="form-group">
          <h6>Icon Name</h6>
          <input
            type="text"
            name="icon"
            value={formFields.icon}
            onChange={changeInput}
            placeholder="FaTruck"
          />
        </div>

        <div className="form-group">
          <h6>Title</h6>
          <input
            type="text"
            name="title"
            value={formFields.title}
            onChange={changeInput}
          />
        </div>

        <div className="form-group">
          <h6>Subtitle</h6>
          <input
            type="text"
            name="subtitle"
            value={formFields.subtitle}
            onChange={changeInput}
          />
        </div>

                  
                    <div className="form-group">
                                     <h6>Status</h6>
                                   <Select
                    value={formFields.status ? "true" : "false"}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        status: e.target.value === "true"
                      })
                    }
                    className="w-100"
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                  </div>
                  

        <div className="form-group">
          <h6>Background Color</h6>
          <input
            type="text"
            name="bg"
            value={formFields.bg}
            onChange={changeInput}
            placeholder="rgb(253,239,230)"
          />
        </div>

        <Button type="submit" className="btn-blue mt-3">
          {isEdit ? "Update" : "Create"}
        </Button>
</div>
      </form>
    </div>
  );
};

export default ServiceUpload;