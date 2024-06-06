import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(AdminGuard)
    @UseGuards(AuthGuard)
    @Patch('users/:id')
    async adminUpdateUser(
        @Body() updateUserDto: AdminUpdateUserDto,
        @Param('id') id: number,
    ) {
        try {
            const user = await this.adminService.adminUpdateUser(+id, updateUserDto);
            return user;
        } catch (error) {
            GetErrorResponse(error);
        }
    }
}
