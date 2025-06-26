-- 🚀 ウルトラシンク 異次元通販 インデックス最適化
-- データ処理爆速化のための究極インデックス設定

-- 🔥 商品テーブル最適化インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_price 
  ON products (category_id, price DESC, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_text 
  ON products USING gin(to_tsvector('japanese', name || ' ' || description));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_stock 
  ON products (status, stock_quantity) WHERE status = 'active';

-- 🚀 注文テーブル爆速インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_status_date 
  ON orders (user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status 
  ON orders (payment_status, total_amount DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_fulfillment 
  ON orders (fulfillment_status, shipped_at) WHERE fulfillment_status != 'pending';

-- 🔥 ユーザーテーブル高速検索
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_verified 
  ON users (email) WHERE email_verified = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_registration_date 
  ON users (created_at DESC, status);

-- 🚀 在庫管理テーブル最適化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_product_location 
  ON inventory (product_id, warehouse_location, quantity DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_low_stock 
  ON inventory (quantity, reorder_point) WHERE quantity <= reorder_point;

-- 🔥 カートテーブル高速アクセス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_session 
  ON cart_items (user_id, session_id, updated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_product_quantity 
  ON cart_items (product_id, quantity) WHERE quantity > 0;

-- 🚀 レビューテーブル最適化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_rating 
  ON reviews (product_id, rating DESC, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_user_helpful 
  ON reviews (user_id, helpful_count DESC) WHERE helpful_count > 0;

-- 🔥 配送テーブル追跡最適化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shipments_tracking 
  ON shipments (tracking_number, status, updated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shipments_delivery_date 
  ON shipments (estimated_delivery, actual_delivery) WHERE status IN ('shipped', 'delivered');

-- 🚀 分析用複合インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_sales_daily 
  ON orders (DATE(created_at), status, total_amount) 
  WHERE status = 'completed';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_product_performance 
  ON order_items (product_id, DATE(created_at), quantity, unit_price);

-- 🔥 パーティショニング準備（大規模データ対応）
-- 注文履歴の月次パーティション用インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_partition_monthly 
  ON orders (DATE_TRUNC('month', created_at), user_id, status);

-- ログテーブル用時系列インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_logs_timestamp_level 
  ON application_logs (created_at DESC, log_level) 
  WHERE log_level IN ('ERROR', 'WARN');

-- 🚀 統計情報更新（パフォーマンス維持）
ANALYZE products;
ANALYZE orders;
ANALYZE users;
ANALYZE inventory;
ANALYZE cart_items;
ANALYZE reviews;
ANALYZE shipments;

-- 🔥 インデックス使用状況確認クエリ
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
*/