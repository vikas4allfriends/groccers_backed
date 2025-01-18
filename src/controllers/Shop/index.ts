import Shop from '../../models/Shop';

export const createShop = async (req:Request) => {
 try {
    const body = await req.json()
    const shop = await Shop.create(body);
      return new Response(JSON.stringify({ success: true, shop }), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
 }  
