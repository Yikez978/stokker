package org.vferrer.stokker.elk;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Component;

@Component
public interface StockQuotationElasticSearchRepository extends ElasticsearchRepository<StockQuotation, Long>
{
	
	public List<StockQuotation> findQuotationsByStock(String stock);
	

}
