--ALTER TABLE tbl_record ADD record_domain TEXT;

--UPDATE tbl_record
--SET record_domain = (SELECT domain_name FROM tbl_domain WHERE tbl_domain.domain_id = tbl_record.domain_id);

