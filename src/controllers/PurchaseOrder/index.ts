import PurchaseOrder from '../../models/PurchaseOrder';
import Product from '../../models/product.models';
import Shop from '../../models/Shop';

export const PurchaseItems = async (req:Request) => {
 try {
  const { shopId, products } = await req.json(); // shopId and array of { productId, quantity,  }

  // Validate shop existence
  const shop = await Shop.findById(shopId);
  if (!shop) {
      return new Response(JSON.stringify({ success: false, error: 'Shop not found' }), { status: 404 });
  }

  let totalAmount = 0;

  // Update product quantities and calculate total amount
  const purchaseOrderProducts = await Promise.all(
      products.map(async ({ productId, quantity, price }) => {
          const product = await Product.findById(productId);price
          if (!product) throw new Error(`Product with ID ${productId} not found`);

          product.Quantity += quantity;
          await product.save();

          totalAmount += quantity * price;
          return { product: productId, quantity, price };
      })
  );

  // Create purchase order
  const purchaseOrder = await PurchaseOrder.create({
      shop: shopId,
      products: purchaseOrderProducts,
      totalAmount,
  });

  return new Response(JSON.stringify({ success: true, purchaseOrder }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
 }  
