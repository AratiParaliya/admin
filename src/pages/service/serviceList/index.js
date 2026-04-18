import { useEffect, useState, useContext } from "react";
import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../../App";
import { deleteData, fetchDataFromApi } from "../../../utils/api";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
            : theme.palette.grey[800];
    
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,

    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },

    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});
const ServiceList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const context = useContext(MyContext);

  useEffect(() => {
    fetchServices();
  }, []);

 const fetchServices = (p = 1) => {
  fetchDataFromApi(`/api/services?page=${p}`).then((res) => {
    setData(res.data || []);
    setPage(res.page || 1);
    setTotalPages(res.totalPages || 1);
  });
    };

    
    const handleChange = (event, value) => {
  fetchServices(value);
};

  const deleteService = async (id) => {
    await deleteData(`/api/services/${id}`);
    fetchServices(page);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Service deleted"
    });
    };
    
 

  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Service List</h5>

     <div className="ml-auto d-flex align-items-center">
  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
                            label="Service List"
      deleteIcon={<ExpandMoreIcon />}
    />

                        </Breadcrumbs>
                        
                        <Link to="/service/add"><Button className="btn-blue  ml-3 p-3 pr-3" style={{ height: "5px" }}>Add Service</Button>
                        </Link>
                    </div>
      </div>

          <div className="card shadow border-0 p-3 mt-4 w-100"> 
                                  <div className="table-responsive mt-3">
        <table className="table table-striped table-bordered v-align ">
                            <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Icon</th>
              <th>Title</th>
                          <th>Subtitle</th>
                          <th>Status</th>
              <th>BG</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
                          {
                              data?.length > 0 ? (
                              data.map((item, i) => (
              <tr key={item._id}>
                <td>{i + 1}</td>
                <td>{item.icon}</td>
                <td>{item.title}</td>
                <td>{item.subtitle}</td>
            <td>
  <span className={`badge ${item.status ? "bg-success" : "bg-secondary"}`}>
    {item.status ? "Active" : "Inactive"}
  </span>
</td>

                <td>{item.bg}</td>

                    <td>
                                  <div className="actions d-flex align-items-center">
                  <Link to={`/service/add/${item._id}`}>
                    <Button className="success" color="success"><FaPencilAlt /></Button>
                  </Link>

                  <Button className="error" color="error" onClick={() => deleteService(item._id)}>
                    <MdDelete />
                            </Button>
                            </div>
                </td>
              </tr>
            )) ) : (
    <tr>
      <td colSpan="10" className="text-center py-4">
        <h5 className="text-muted">No Services Found 😔</h5>
      </td>
    </tr>
  )}
          </tbody>
        </table>
</div>
          <div className="d-flex justify-content-between align-items-center mt-3">
        <p>
          Showing <b>{page}</b> of <b>{totalPages}</b> pages  
          
        </p>
      
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
      </div>
    </div>
  );
};

export default ServiceList;