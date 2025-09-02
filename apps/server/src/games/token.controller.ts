import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTokenDto, Token } from './dto/create-token.dto';
import { TokenService } from './token.service';

@Controller('')
export class TokenController {
  constructor(private readonly service: TokenService) {}

  @ApiOperation({ summary: 'Add new token' })
  @ApiResponse({
    status: 201,
    description: 'Token added successfully',
    type: Token,
  })
  @Post('/add-token')
  create(@Body() dto: CreateTokenDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'get all tokens' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: [Token],
  })
  @Get('/get-all-tokens')
  findAll() {
    return this.service.findAll();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a token' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Token deleted successfully' })
  @Delete('/token/delete/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
