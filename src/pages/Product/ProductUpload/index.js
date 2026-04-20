import { styled, emphasize } from "@mui/material/styles";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useEffect, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { Button, IconButton, Chip, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import { MyContext } from "../../../App";
import {  useNavigate } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../../utils/api";

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





const ProductUpload = () => {

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState();


const [isLoading, setIsLoading] = useState(false);
const [previews, setpreviews] = useState([]);
const [subCategoryVal, setSubCategoryVal] = useState('');
  const [productImagesArr, setProductImagesArr] = useState([]);

  const [imgFiles, setImgFiles] = useState();

  const [subCategory, setSubCategory] = useState([]);

  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showRamInput, setShowRamInput] = useState(false);

  // 🔹 Custom values
  const [customSize, setCustomSize] = useState("");
  const [customWeight, setCustomWeight] = useState("");
  const [customRam, setCustomRam] = useState("");


  const { id } = useParams(); // 👈 get product id
  const isEditMode = Boolean(id);
  
 const [formFields, setFormFields] = useState({
  name: '',
  description: '',
   images: [],
  color:'',
  brand: '',
  price: "",
  oldPrice: "",
  category: '',
  subCategory: '', // ✅ ADD THIS
  countInStock: "",
  rating: "",
   isFeatured: null,
   discount: "",
    specifications: [
    { key: "", value: "" }
  ],
   productRAMS: [],
   productSIZE: [],
  productWEIGHT:[],
 });
  
  
 
  const defaultSizeOptions = ["S","M","L","XL","XXL",
    "Small","Medium","Large",
    "IND-4","IND-5","IND-6","IND-7","IND-8",
    "28","30","32","34","36"];
  const defaultWeightOptions = ["500GM","1KG","2KG","3KG"];
  const defaultRamOptions = ["4GB","6GB","8GB","10GB","12GB"];

  // 🔥 Merge DB values with default options (IMPORTANT)
  const sizeOptions = [
    ...new Set([...(formFields.productSIZE || []), ...defaultSizeOptions])
  ];

  const weightOptions = [
    ...new Set([...(formFields.productWEIGHT || []), ...defaultWeightOptions])
  ];

  const ramOptions = [
    ...new Set([...(formFields.productRAMS || []), ...defaultRamOptions])
  ];
  
 const addValue = (field, value, setCustom, setShow) => {
    if (!value) return;

    const existing = formFields[field] || [];

    if (existing.includes(value)) {
      setCustom("");
      setShow(false);
      return;
    }

    setFormFields({
      ...formFields,
      [field]: [...existing, value]
    });

    setCustom("");
    setShow(false);
  };
  
useEffect(() => {
  if (id !== undefined) {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {

      const categoryId = res.category?._id || res.category;
      const subCategoryId = res.subCategory?._id || res.subCategory;

      setFormFields({
        name: res.name,
        description: res.description,
        images: res.images || [],
        color: res.color,
        brand: res.brand,
        price: res.price,
        oldPrice: res.oldPrice,
        category: categoryId,
        subCategory: subCategoryId,
        countInStock: res.countInStock,
        isFeatured: res.isFeatured,
        discount: res.discount || "",
        productRAMS: res.productRAMS || [],
        productSIZE: res.productSIZE || [],
        productWEIGHT: res.productWEIGHT || [],
        specifications: res.specifications?.length
          ? res.specifications
          : [{ key: "", value: "" }]
      });

      // ✅ ADD THIS LINE
  setProductImagesArr(res.images?.flat() || []);

    });
  }
}, [id]);

useEffect(() => {
  fetchDataFromApi("/api/category/all").then((res) => {
    console.log("CATEGORY API:", res);

    const data =
      res?.categoryList ||
      res?.data?.categoryList ||
      (Array.isArray(res) ? res : []);

    setCategories(data);
  });
}, []);

  useEffect(() => {
  if (formFields.category) {
    fetchDataFromApi(`/api/subcategory?category=${formFields.category}`)
      .then((res) => {
        setSubCategory(res?.subcategoryList || []);
      });
    
    
  }
}, [formFields.category]);

  useEffect(() => {

    if (!imgFiles) return;

    let tmp = [];
    for (let i = 0; i < imgFiles.length; i++){
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }
    const objectUrls = tmp;
    setpreviews(objectUrls);

    return () => {
  objectUrls.forEach(url => URL.revokeObjectURL(url));
};
  },[imgFiles])

  const context = useContext(MyContext);


const removeImg = (index) => {
  const updated = productImagesArr.filter((_, i) => i !== index);

  setProductImagesArr(updated);

  setFormFields({
    ...formFields,
    images: updated
  });
};

const handleChangeCategory = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    category: value,
    subCategory: ""
  }));

  setSubCategoryVal(""); // reset UI

  fetchDataFromApi(`/api/subcategory?category=${value}`).then((res) => {
    setSubCategory(res?.subcategoryList || []);
  });
};

 const handleSubChangeCategory = (event) => {
  setFormFields((prev) => ({
    ...prev,
    subCategory: event.target.value
  }));
};

const handleChangeisFeaturedValue = (event) => {
  setFormFields((prev) => ({
    ...prev,
    isFeatured: event.target.value === "true"
  }));
};

const handleChangeProductWeight = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productWEIGHT: value
  }));
};

 const handleChangeProductSize = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productSIZE: value
  }));
};
const handleChangeProductRams = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productRAMS: value   // ✅ array directly
  }));
};
  
  
  const navigate = useNavigate();

    const inputChange = (e)=> {
    setFormFields(() => ({
    ...formFields,
      [e.target.name]:e.target.value
  }))
  }
  

  const handleSubmit = (e) => {
     
    e.preventDefault();
      setIsLoading(true);

    if (formFields.name === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Name',
      });
  setIsLoading(false);
return;
    }

     if (formFields.description === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product description',
      });
  setIsLoading(false);
return;
    }
    if (productImagesArr.length === 0) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Image',
      });
   setIsLoading(false);
return;
    }
  
    if (formFields.brand === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Brand',
      });
   setIsLoading(false);
return;
    }
     if (formFields.discount === 0 || formFields.discount === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Discount',
      });
 setIsLoading(false);
return;
    }
    if (formFields.price === 0 || formFields.price === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Price',
      });
setIsLoading(false);
return;
    }
    if (formFields.oldPrice === 0 || formFields.oldPrice === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product OldPrice',
      });
     setIsLoading(false);
return;
    }
 if (formFields.category === "") {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please select the product category',
  });
 setIsLoading(false);
return;
    }
    if (formFields.subCategory === "") {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please select the product subcategory',
  });
 setIsLoading(false);
return;
}
   if (formFields.isFeatured === null || formFields.isFeatured === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please select the product is a featured or not',
      });
    setIsLoading(false);
return;
    }
if (formFields.countInStock === "" || formFields.countInStock === 0) {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please add stock',
  });
 setIsLoading(false);
return;
}
    // if (!formFields.rating) {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: 'Please add Rating'
    //   });
    // setIsLoading(false);
//return;
    // }
    
      
    const data = {
  ...formFields,
  images: productImagesArr
    };
     if (isEditMode) {
    editData(`/api/products/${id}`, data).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product Updated Successfully",
      });

      setIsLoading(false);
      navigate('/products');
    });

  } else {
    // ✅ ADD MODE
    postData('/api/products/create', data).then((res) => {
      if (!res) {
      throw new Error("API failed");
    }

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Product Created Successfully",
    });

    setIsLoading(false);
    navigate('/products');

      setIsLoading(false);
      navigate('/products');
       setFormFields({
      name: '',
      description: '',
      images: [],
      color:'',
      brand: '',
      price: "",
      oldPrice: "",
      category: '',
      subCategory: '',
      countInStock: "", 
      isFeatured: "",
       discount: "",
   productRAMS: [],
   productSIZE: [],
         productWEIGHT: [],
  
       })
      
    });
       
  }
 


  };
  
const onChangeFile = async (e) => {
  try {
    const files = e.target.files;
    const formdata = new FormData();

    for (let i = 0; i < files.length; i++) {
      formdata.append("images", files[i]); // ✅ IMPORTANT
    }

    setUploading(true);

    const res = await postData('/api/upload', formdata);

    console.log("UPLOAD RESPONSE:", res); // 🔍 debug

    if (res?.images) {
      setProductImagesArr(prev => [...prev, ...res.images]);
    }

    setUploading(false);

  } catch (error) {
    console.error(error);
    setUploading(false);
  }
};
  

// add new row
const addSpecification = () => {
  setFormFields(prev => ({
    ...prev,
    specifications: [...prev.specifications, { key: "", value: "" }]
  }));
};

// remove row
const removeSpecification = (index) => {
  const updated = formFields.specifications.filter((_, i) => i !== index);

  setFormFields(prev => ({
    ...prev,
    specifications: updated
  }));
};

// handle change
const handleSpecChange = (index, field, value) => {
  const updated = [...formFields.specifications];
  updated[index][field] = value;

  setFormFields(prev => ({
    ...prev,
    specifications: updated
  }));
};

    return (
        <>
                 <div className="right-content w-100">
                        <div className="card shadow border-0 w-100 flex-row p-4">
           <h5 className="mb-0">
  {isEditMode ? "Edit Product" : "Product Upload"}
</h5>
            
              <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                
                <StyledBreadcrumb
                  component="a"
                  href="#"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
            
                        <StyledBreadcrumb
                             component="a"
                            label="Products"
                             href="#"
                  deleteIcon={<ExpandMoreIcon />}
                        />
                        
                        <StyledBreadcrumb
                            label="Product Upload"
                  deleteIcon={<ExpandMoreIcon />}
                />
            
              </Breadcrumbs>
                            </div>
            
          <form className="form"  onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card p-4 mt-0">
                  <h5 className="mb-4">Basic Information</h5>
                  
                  <div className="form-group">
                    <h6>Product Name</h6>
                    <input type="text" name="name" value={formFields.name} onChange={inputChange} placeholder="type here...."/>
                  </div>

                   <div className="form-group">
                    <h6>Description</h6>
                    <textarea rows={5} cols={10} value={formFields.description} name="description" onChange={inputChange} />
                  </div>

                  <div className="row">     
                <div className="col">
                  <div className="form-group">
                   <h6>CATEGORY</h6>
                   <Select
          value={formFields.category}
          onChange={handleChangeCategory}
 MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 250,   // 👈 controls dropdown height
        overflowY: "auto" // 👈 enables scroll
      }
    }
  }}
          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
           <MenuItem value="">
    <em>Select</em>
  </MenuItem>

                          {
                           categories?.map((cat) => (
  <MenuItem key={cat._id} value={cat._id}>
    {cat.name}
  </MenuItem>
))
                          }
                                </Select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                   <h6>SUBCATEGORY</h6>
                   <Select
     value={formFields.subCategory}
          onChange={handleSubChangeCategory}
 MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 250,   // 👈 controls dropdown height
        overflowY: "auto" // 👈 enables scroll
      }
    }
  }}
          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
           <MenuItem value="">
    <em>Select</em>
  </MenuItem>

                          {
                            subCategory?.length!==0 && subCategory.map((subcat, index) => (
    <MenuItem key={index} value={subcat._id}>
      {subcat.name} 
    </MenuItem>
                            ))
                          }
                                </Select>
                  </div>
                </div>
                <div className="col">

                     <div className="form-group">
                   <h6>Brand</h6>
                     <input type="text" name="brand" value={formFields.brand} onChange={inputChange} placeholder="type here..."/>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <h6>Regular Price</h6>
                      <input type="text" name="price" value={formFields.price} onChange={inputChange} placeholder="type here"/>
                  </div>
                </div>
                
                <div className="col">
                  <div className="form-group">
                    <h6>Old Price</h6>
                      <input type="text" name="oldPrice" value={formFields.oldPrice} onChange={inputChange} placeholder="type here"/>
                  </div>
                    </div>
                    <div className="col">
                  <div className="form-group">
                    <h6>Discount</h6>
                      <input type="text" name="discount" value={formFields.discount} onChange={inputChange} placeholder="type here"/>
                  </div>
                  </div>
              </div>
              
                  <div className="row">
                    <div className="col">
                  <div className="form-group">
                    <h6>Product Stock</h6>
                      <input type="text" name="countInStock" value={formFields.countInStock} onChange={inputChange} placeholder="type here"/>
                  </div>
                  </div>
                <div className="col">
                  <div className="form-group">
                    <h6 className="text-uppercase">isFeatured</h6>
                       <Select
  value={formFields.isFeatured ?? ""}
  onChange={handleChangeisFeaturedValue}
  displayEmpty
  className="w-100"
>
  <MenuItem value="">
    <em>Select</em>
  </MenuItem>

 <MenuItem value="true">True</MenuItem>
<MenuItem value="false">False</MenuItem>
</Select>
                  </div>
                </div>
                  <div className="col">
                  <div className="form-group">
                    <h6>Product Color</h6>
                                        <input type="text" name="color" value={formFields.color} onChange={inputChange} placeholder="type here"/>

                  </div>
                    </div>
             
                  </div>
              
      <div className="row">

      {/* ================= SIZE ================= */}
      <div className="col">
        <div className="form-group">
          <h6 className="text-uppercase">Product Size</h6>

<Select
  multiple
  value={formFields.productSIZE || []}
  onChange={(e) =>
    setFormFields({
      ...formFields,
      productSIZE: e.target.value
    })
  }
  className="w-100"
  renderValue={(selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((value) => (
        <Chip
          key={value}
          label={value}
          onDelete={() => {
            const updated = formFields.productSIZE.filter(
              (item) => item !== value
            );
            setFormFields({
              ...formFields,
              productSIZE: updated
            });
          }}
          onMouseDown={(e) => e.stopPropagation()} // ✅ prevents dropdown open
        />
      ))}
    </Box>
  )}
>
  {sizeOptions.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))}
</Select>

          <Button size="small" onClick={() => setShowSizeInput(!showSizeInput)}>
            + Add Custom
          </Button>
{showSizeInput && (
  <div className="custom-input-box">

    <TextField
      size="small"
      autoFocus
      variant="outlined"
      className="custom-textfield"
      value={customSize}
      onChange={(e) => setCustomSize(e.target.value)}
      placeholder="Enter size (e.g. XXL)"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addValue("productSIZE", customSize, setCustomSize, setShowSizeInput);
        }
      }}
    />

    {/* ➕ Add */}
    <Button
      className="icon-btn add-btn"
      onClick={() =>
        addValue("productSIZE", customSize, setCustomSize, setShowSizeInput)
      }
    >
      +
    </Button>

    {/* ❌ Cancel */}
    <Button
      className="icon-btn cancel-btn"
      onClick={() => {
        setShowSizeInput(false);
        setCustomSize("");
      }}
    >
      ✕
    </Button>

  </div>
)}
        </div>
      </div>

      {/* ================= WEIGHT ================= */}
      <div className="col">
        <div className="form-group">
          <h6 className="text-uppercase">Product Weight</h6>

<Select
  multiple
  value={formFields.productWEIGHT || []}
  onChange={(e) =>
    setFormFields({
      ...formFields,
      productWEIGHT: e.target.value
    })
  }
  className="w-100"
  renderValue={(selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((value) => (
        <Chip
          key={value}
          label={value}
          onDelete={() => {
            const updated = formFields.productWEIGHT.filter(
              (item) => item !== value
            );
            setFormFields({
              ...formFields,
              productWEIGHT: updated
            });
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ))}
    </Box>
  )}
>
  {weightOptions.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))}
</Select>

          <Button size="small" onClick={() => setShowWeightInput(!showWeightInput)}>
            + Add Custom
          </Button>
{showWeightInput && (
  <div className="custom-input-box">

    <TextField
      size="small"
      autoFocus
      variant="outlined"
      className="custom-textfield"
      value={customWeight}
      onChange={(e) => setCustomWeight(e.target.value)}
      placeholder="Enter weight (e.g. 1.5kg)"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addValue("productWEIGHT", customWeight, setCustomWeight, setShowWeightInput);
        }
      }}
    />

    {/* ➕ Add */}
    <Button
      className="icon-btn add-btn"
      onClick={() =>
        addValue("productWEIGHT", customWeight, setCustomWeight, setShowWeightInput)
      }
    >
      +
    </Button>

    {/* ❌ Cancel */}
    <Button
      className="icon-btn cancel-btn"
      onClick={() => {
        setShowWeightInput(false);
        setCustomWeight("");
      }}
    >
      ✕
    </Button>

  </div>
)}
        </div>
      </div>

      {/* ================= RAM ================= */}
      <div className="col">
        <div className="form-group">
          <h6 className="text-uppercase">Product RAM</h6>
<Select
  multiple
  value={formFields.productRAMS || []}
  onChange={(e) =>
    setFormFields({
      ...formFields,
      productRAMS: e.target.value
    })
  }
  className="w-100"
  renderValue={(selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((value) => (
        <Chip
          key={value}
          label={value}
          onDelete={() => {
            const updated = formFields.productRAMS.filter(
              (item) => item !== value
            );
            setFormFields({
              ...formFields,
              productRAMS: updated
            });
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ))}
    </Box>
  )}
>
  {ramOptions.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))}
</Select>

          <Button size="small" onClick={() => setShowRamInput(!showRamInput)}>
            + Add Custom
          </Button>
{showRamInput && (
  <div className="custom-input-box">

    <TextField
      size="small"
      autoFocus
      variant="outlined"
      className="custom-textfield"
      value={customRam}
      onChange={(e) => setCustomRam(e.target.value)}
      placeholder="Enter RAM (e.g. 16GB)"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addValue("productRAMS", customRam, setCustomRam, setShowRamInput);
        }
      }}
    />

    {/* ➕ Add */}
    <Button
      className="icon-btn add-btn"
      onClick={() =>
        addValue("productRAMS", customRam, setCustomRam, setShowRamInput)
      }
    >
      +
    </Button>

    {/* ❌ Cancel */}
    <Button
      className="icon-btn cancel-btn"
      onClick={() => {
        setShowRamInput(false);
        setCustomRam("");
      }}
    >
      ✕
    </Button>

  </div>
)}
        </div>
      </div>

    </div>

<div className="card p-4 mt-3">
  <h5 className="mb-4">Product Specifications</h5>

  {
    (formFields.specifications || []).map((spec, index) => (
      <div className="row specification mb-2" key={index}>
        
        {/* Key */}
        <div className="col w-100">
          <input
            type="text"
            placeholder="e.g. Color"
            value={spec.key}
            onChange={(e) =>
              handleSpecChange(index, "key", e.target.value)
            }
          />
        </div>

        {/* Value */}
        <div className="col w-100">
          <input
            type="text"
            placeholder="e.g. Red"
            value={spec.value}
            onChange={(e) =>
              handleSpecChange(index, "value", e.target.value)
            }
          />
        </div>

        {/* Remove Button */}
        <div className="col-auto d-flex align-items-center">
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeSpecification(index)}
          >
            Remove
          </Button>
        </div>

      </div>
    ))
  }

  {/* Add Button */}
  <Button
    variant="contained"
    className="mt-2"
    onClick={addSpecification}
  >
    + Add Specification
  </Button>
</div>
              
              <div className="card p-4">
<div className="imagesUploadSec">
  <h5 className="mb-4">Media And Published</h5>

  <div className="imgUploadBox d-flex align-items-center">

    {
   productImagesArr.map((img, index) => (
                  <div className="uploadBox" key={index}>
                    <span className="remove" onClick={() => removeImg(index)}>X</span>

                    <div className="box">
                   <img
  src={img}
  className="w-100"
  alt="img"
/>
                    </div>
                  </div>
                ))
    }

    {/* Upload Button */}
    <div className="uploadBox">

      {
        uploading === true ?
        <div className="progressBar">
          <CircularProgress />
          <span>Uploading...</span>
        </div>
        :
        <>
        <input
  type="file"
  multiple
  onChange={(e) => {
    onChangeFile(e);
    e.target.value = null; 
  }}
  name="images"
/>

          <div className="info">
            <FaRegImages />
            <h5>image upload</h5>
          </div>
        </>
                        }
                    

    </div>

  </div>

  <Button type="submit"  onClick={handleSubmit} className="btn-blue btn-lg w-100 mt-4">
    <FaCloudUploadAlt /> &nbsp; Publish and View
  </Button>
</div>

         
</div>
                 </div>
    
               
</div>
       </div>
            
            </form>
                           
                            </div>
        </>
    )
}
export default ProductUpload;