import { Controller } from '@nestjs/common';
import { DetailTransaksiService } from './detail-transaksi.service';

@Controller('detail-transaksi')
export class DetailTransaksiController {
  constructor(private readonly detailTransaksiService: DetailTransaksiService) {}
}
