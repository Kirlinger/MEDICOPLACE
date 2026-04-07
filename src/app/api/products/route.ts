/**
 * GET /api/products
 * Return product catalog. Serves from database if configured, otherwise from static data.
 */
import { NextRequest } from 'next/server';
import { getSupabaseAdmin, isDatabaseConfigured } from '@/lib/server/db';
import { getClientIp, applyRateLimit } from '@/lib/server/api-helpers';
import { products as staticProducts, categories as staticCategories } from '@/data/products';

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'products', 'api');
  if (rateLimitError) return rateLimitError;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) {
      // Fallback to static data on DB error
      return Response.json({ products: staticProducts, categories: staticCategories });
    }

    const categories = ['Tous', ...new Set(products.map((p: { category: string }) => p.category))];
    return Response.json({ products, categories });
  }

  // No database — serve static data
  return Response.json({ products: staticProducts, categories: staticCategories });
}
