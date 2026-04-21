import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
 import { MenuItem, Select, Card, CardContent, Typography } from "@mui/material";
import { editData1, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from "@mui/material";
const UpdateOrder = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const context = useContext(MyContext);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
 // 👈 OPEN MODAL BY DEFAULT


useEffect(() => {
  context.setIsHeaderSidebarShow(false); // ✅ hide

  return () => {
    context.setIsHeaderSidebarShow(true); // ✅ show again when leaving
  };
}, []);

useEffect(() => {
  const getOrder = async () => {
    try {
      setPageLoading(true);

      const data = await fetchDataFromApi(`/api/orders/${id}`);

      if (!data.order) return;

      setOrder(data.order);
      setStatus(data.order.status || "Pending");
      setIsPaid(data.order.isPaid || false);

    } catch (err) {
      console.log(err);
    } finally {
      setPageLoading(false);
    }
  };

  getOrder();
}, [id]);

const updateStatus = async () => {
  try {
    setLoading(true);

    const data = await editData1(`/api/orders/${id}`, {
      status,
      isPaid
    });

    if (data.success) {
      setSuccess(true); // ✅ show animation

      context.setAlertBox({
        open: true,
        msg: "Order Updated ✅",
        error: false
      });

      // ⏳ wait then close modal
      setTimeout(() => {
        setOpen(false);
      }, 1500);

    } else {
      context.setAlertBox({
        open: true,
        msg: "Update Failed ❌",
        error: true
      });
    }

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

if (pageLoading) {
  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </div>
  );
}


return (
 <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
    
    <DialogTitle style={{ textAlign: "center", fontWeight: 600 }}>
      Update Order Status
    </DialogTitle>

  <DialogContent style={{ textAlign: "center", padding: "30px" }}>

  {success ? (
    <div className="success-box">
      <div className="checkmark-circle">
        <div className="checkmark"></div>
      </div>
      <h3 style={{ marginTop: "15px" }}>Order Updated!</h3>
    </div>
  ) : (
    <>
      <Typography variant="body2" gutterBottom>
        <b>Order ID:</b> {order._id}
      </Typography>

      <Typography variant="body2" gutterBottom>
        <b>User:</b> {order.userId?.name}
      </Typography>

      <Select
        fullWidth
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ marginTop: "20px" }}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Ordered">Ordered</MenuItem>
        <MenuItem value="Processing">Processing</MenuItem>
        <MenuItem value="Shipped">Shipped</MenuItem>
        <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
        <MenuItem value="Delivered">Delivered</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>

      <Select
        fullWidth
        value={isPaid ? "Paid" : "Pending"}
        onChange={(e) => setIsPaid(e.target.value === "Paid")}
        style={{ marginTop: "20px" }}
      >
        <MenuItem value="Paid">Paid</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
      </Select>
    </>
  )}

</DialogContent>
<DialogActions>
  {!success && (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>

      <Button
        onClick={updateStatus}
        variant="contained"
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : "Update"}
      </Button>
    </>
  )}
</DialogActions>

  </Dialog>
);
};

export default UpdateOrder;