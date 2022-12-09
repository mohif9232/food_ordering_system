let { register_me, login_me, update_me, change_pass, forget_me, reset_me, get_me, add_profile, update_profile, deactivate_me, activate_me, findUser, assignPermission, getAllPer, userPermission, updateUser, deleteUser, unDeleteUser, activeUser, unActiveUser, exportUsers } = require("../controller/user")
let { addCategory, updateCategory, categoryView, deleteCategory, UndeleteCategory, activeCategory, unactiveCategory } = require("../controller/category")
let { addDish, updateDish, viewDish, deleteDish, undeleteDish, blockDish, unblockDish, exportProduct } = require("../controller/product")
let { addCart, updateCart, viewCart, removeCart } = require("../controller/cart")

let { placeOrder, orderView, orderAllview, payment, confirmOrder, cancelOrder, cancelOrderAdmin, delivery_status } = require("../controller/order")

let errorHandler = require("../middleware.js/errorhandler")
require("express-async-errors");
let express = require("express");
let app = express();
let auth = require("../middleware.js/auth")


app.post("/forget_password", forget_me);
app.post("/reset_password", reset_me);

app.post("/register", register_me)
app.post("/login", login_me)

app.put("/update_me", auth("User"), update_me);
app.get("/about_me", auth("User"), get_me)

app.post("/change_password", auth("User"), change_pass)
app.delete("/deactivate_me", auth("User"), deactivate_me)
app.put("/activate_me", activate_me)



app.post("/upload_profile_pic", auth("User"), add_profile);
app.post("/update_profile_pic", auth("User"), update_profile)

app.get("/view_dish", viewDish);
app.get("/view_category", categoryView);

app.get("/view_user", auth("getUser"), findUser);

app.post("/assign_permission", auth("assignPermission"), assignPermission);
app.get("/view_permission", auth("getPermission"), getAllPer);
app.get("/view_userPermission", auth("getPermission"), userPermission);

app.put("/updateUser", auth("updateUser"), updateUser)
app.delete("/deleteUser", auth("deleteUser"), deleteUser)
app.delete("/unDeleteUser", auth("deleteUser"), unDeleteUser)

app.put("/blockUser", auth("blockUser"), unActiveUser);
app.put("/unblockUser", auth("blockUser"), activeUser);

app.post("/add_category", auth("addCategory"), addCategory);
app.put("/update_category", auth("updateCategory"), updateCategory);


app.delete("/delete_category", auth("deleteCategory"), deleteCategory);
app.delete("/undelete_category", auth("deleteCategory"), UndeleteCategory);

app.put("/available_category", auth("blockCategory"), activeCategory);
app.put("/unavailable_category", auth("blockCategory"), unactiveCategory)

app.post("/add_dish", auth("addDish"), addDish);
app.put("/update_dish", auth("UpdateDish"), updateDish);


app.delete("/delete_dish", auth("deleteProduct"), deleteDish);
app.delete("/undelete_dish", auth("deleteProduct"), undeleteDish);

app.put("/block_dish", auth("blockDish"), blockDish);
app.put("/unblock_dish", auth("blockDish"), unblockDish);

app.post("/add_to_cart", auth("User"), addCart);
app.put("/update_cart", auth("User"), updateCart);
app.delete("/delete_from_cart", auth("User"), removeCart);

app.get("/view_my_cart", auth("User"), viewCart)

app.post("/place_order", auth("User"), placeOrder)
app.get("/my_orders", auth("User"), orderView)
app.post("/payment", auth("User"), payment)
app.post("/cancel_my_order", auth("User"), cancelOrder)

app.get("/view_user_orders", auth("viewOrders"), orderAllview)
app.post("/confirm_user_order", auth("confirmOrders"), confirmOrder)
app.post("/cancel_user_order", auth("cancelOrders"), cancelOrderAdmin)
app.put("/make_delivery", auth("makeDelivery"), delivery_status)

app.get("/export_users", auth("getUser"), exportUsers)
app.get("/export_products", auth("addDish"), exportProduct)




app.use(errorHandler)

module.exports = app