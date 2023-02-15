import { Test, TestingModule } from '@nestjs/testing';
import { DetailTransaksiController } from './detail-transaksi.controller';
import { DetailTransaksiService } from './detail-transaksi.service';

describe('DetailTransaksiController', () => {
  let controller: DetailTransaksiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailTransaksiController],
      providers: [DetailTransaksiService],
    }).compile();

    controller = module.get<DetailTransaksiController>(DetailTransaksiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
